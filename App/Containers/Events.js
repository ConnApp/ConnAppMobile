import React, { Component } from 'react'
import { SectionList, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import EventCard from '../Components/EventCard'
import EventCategoryCard from '../Components/EventCategoryCard'
import Mongoose from '../Datastore'
import styles from './Styles/EventsStyles'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})
let mongo = new Mongoose(['events', 'locals'])

const events = [{
  key:  '',
  data: [],
}]


export default class Events extends Component {
  constructor () {
    super()
    this.state = {
      events: [{
        key:  'Carregando...',
        data: [],
      }]
    }
  }

  componentWillMount() {
    const queryTest = {
      dateQuery: this.getTodayFilter()
    }

    mongo.db.events.on('insert', (data) => {
      console.log('event inser')
    })

    mongo.db.events.on('update', (data) => {

    })

    mongo.db.locals.on('insert', local => {
      // this.updateLocalView(local)
    })

    mongo.db.locals.on('update', local => {
      // this.updateLocalView(local)
    })

    mongo.db.events.find(queryTest)
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

  sortByRoom (sectionA, sectionB) {
    sectionA = sectionA.key.toUpperCase();
    sectionB = sectionB.key.toUpperCase();
    return (sectionA < sectionB) ? -1 : (sectionA > sectionB) ? 1 : 0;
  }

  getTodayFilter() {
    const day = parseInt(this.props.navigation.state.key.split(' ')[1])
    return {
      start: { $gt: new Date(2017, 9, day, 0, 0, 0) },
      end: { $lt: new Date(2017, 9, day + 1, 0, 0, 0)}
    }
  }

  groupByLocal(dbEvents, sortFunction) {
    let eventsArray = []
    let cacheIndex = {}
    if (!sortFunction) sortFunction = this.sortByRoom

    dbEvents.forEach(event => {
      let data = { name: event.name, start: event.start, end: event.end }
      if (!(cacheIndex[event.local] || {}).index) {
        eventsArray.push({
          key: event.local,
          data: [data]
        })
        cacheIndex[event.local] = { index: eventsArray.length, data: {} }
        cacheIndex[event.local].data[event._id] = 1
      } else {
        let keyIndex = cacheIndex[event.local].index - 1
        if (cacheIndex[event.local].data[event._id]) {
          let dataIndex = cacheIndex[event.local].data[event._id] - 1
          eventsArray[keyIndex].data[dataIndex] = data
        } else {
          eventsArray[keyIndex].data.push(data)
          cacheIndex[event.local].data[event._id] = eventsArray[keyIndex].data.length
        }
      }
    })
    eventsArray = eventsArray.sort(sortFunction)
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
