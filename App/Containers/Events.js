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
const mongo = new Mongoose(['events', 'locals', 'eventtypes'])

const events = [{
  key:  'Carregando Salas',
  data: [{
    name: 'Carregando eventos',
    eventType: '',
    start: undefined,
    end: undefined
  }],
}]

export default class Events extends Component {
  constructor () {
    super()
    this.state = {
      events: events
    }
    this.events = []
    this.eventtypes = []
    this.locals = []
  }

  setNewEventsState () {
    let locals = this.reduceToId(this.locals)
    let eventTypes = this.reduceToId(this.eventTypes)

    this.events = this.events.map(event => {
      event.local = locals[event.local]
      event.eventType = eventTypes[event.eventType]
      return event
    })

    this.groupEventsByLocal()
  }

  insertLocal (local) {
    this.locals = this.locals? [...this.locals, local] : [local]

    this.setNewEventsState()
  }

  updateLocal (newLocal) {
    this.locals = (this.locals || [newLocal]).map(local => {
      if (local._id == newLocal._id) {
        local = newLocal
      }
      return local
    })

    this.setNewEventsState()
  }

  insertEvent (event) {
    this.events = this.events? [...this.events, event] : [event]

    this.setNewEventsState()
  }

  updateEvent (newEvent) {
    this.events = (this.events || [newEvent]).map(event => {
      if (event.key.split(' - ')[1] == newEvent.local) {
        event.data = event.data.map(ev =>
          ev._id == newEvent._id? newEvent : ev
        )
      }
      return event
    })

    this.setNewEventsState()
  }

  componentDidMount() {

    mongo.db.locals.on('insert', this.insertLocal.bind(this))

    mongo.db.locals.on('update', this.updateLocal.bind(this))

    mongo.db.events.on('insert', this.insertEvent.bind(this))

    mongo.db.events.on('update', this.updateEvent.bind(this))

    mongo.db.events.find({ dateQuery: this.getTodayFilter() })
      .then(dbEvents => {
        this.events = [...dbEvents]
        return mongo.db.eventtypes.find({})
      })
      .then(eventTypes => {
        this.eventTypes = [...eventTypes]
        return mongo.db.locals.find({})
      })
      .then(locals => {
        this.locals = [...locals]
        this.setNewEventsState()
      })
      .catch(err => {
        // console.log(err)
      })
  }

  reduceToId (docs) {
    console.log(docs)
    return !docs? [] : docs.reduce((docHashTable, doc) => {
      docHashTable[doc._id] = `${doc.name} - ${doc._id}`
      return docHashTable
    }, {})
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

  groupEventsByLocal(sectionSort = this.sortByRoom, sortEvents = this.sortByStart) {

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
