import React, { Component } from 'react'
import { SectionList, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import EventCard from '../Components/EventCard'
import EventCategoryCard from '../Components/EventCategoryCard'
import Mongoose from '../Datastore'
import { groupBy } from '../Helpers'
import styles from './Styles/EventsStyles'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})
let mongo = new Mongoose(['events', 'locals'])

const events = [{
  key:  'Carregando...',
  data: [],
}]

export default class Events extends Component {
  constructor () {
    super()
    this.state = {
      events: events
    }
  }

  componentWillMount() {
    const dateQuery = this.getTodayFilter()

    mongo.db.events.on('insert', event => {
      console.log('event inserted')
    })

    mongo.db.events.on('update', event => {
      console.log('event updated')
    })

    mongo.db.locals.on('insert', local => {
      console.log('local inserted')
    })

    mongo.db.locals.on('update', local => {
      console.log('local updated')
    })

    mongo.db.events.find({dateQuery})
      .then(dbEvents => {
        this.events = [...dbEvents]
        return mongo.db.locals.find({})
      })
      .then(locals => {
        locals = locals.reduce((localHashTable, local) => {
          localHashTable[local._id] = local.name
          return localHashTable
        }, {})

        this.events = this.events.map(event => {
          event.local = locals[event.local]
          return event
        })

        this.groupByLocal(this.events)
      })
      .catch(err => {
        // console.log(err)
      })
  }


  getTodayFilter() {
    const day = parseInt(this.props.navigation.state.key.split(' ')[1])
    return {
      start: { $gt: new Date(2017, 9, day, 0, 0, 0) },
      end: { $lt: new Date(2017, 9, day + 1, 0, 0, 0)}
    }
  }

  sortByStart (eventA, eventB) {
    eventA = new Date(eventA.start).getTime();
    eventB = new Date(eventB.start).getTime();
    return (eventA < eventB) ? -1 : (eventA > eventB) ? 1 : 0;
  }

  sortByRoom (sectionA, sectionB) {
    sectionA = sectionA.key.toUpperCase();
    sectionB = sectionB.key.toUpperCase();
    return (sectionA < sectionB) ? -1 : (sectionA > sectionB) ? 1 : 0;
  }

  groupByLocal(
    dbEvents,
    sectionSort = this.sortByRoom,
    sortEvents = this.sortByStart
  ) {

    let eventsArray =
      groupBy(this.events, 'local')
      .map(event => ({
        ...event,
        data: event.data.sort(sortEvents)
      }))

    eventsArray = eventsArray.sort(sectionSort)

    this.setState({
      events: eventsArray
    })

    // console.log(this.state.events)
  }

  renderCard (event) {
    return <EventCard event={event.item} />
  }
  renderHeader (title) {
    return (
      <View style={styles.category}>
        <EventCategoryCard title={title} />
      </View>
    )
  }

  render () {
    return (
      <View contentContainerStyle={styles.contentContainer}>
        <SectionList
          keyExtractor={(item, index) => index}
          stickySectionHeadersEnabled={true}
          renderItem={this.renderCard}
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.scrollView}
          sections={this.state.events}
        />
      </View>
    )
  }
}
