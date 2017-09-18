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

    let events = this.events.map(eventRef => {
      let event = {...eventRef}
      event.local = locals[event.local]
      event.eventType = eventTypes[event.eventType]
      return event
    })

    this.groupEventsByLocal(events)
  }

  insertLocal (local) {
    if (this.isArray(local)) local =  local[0]
    this.locals = this.locals? [...this.locals, local] : [local]

    this.setNewEventsState()
  }

  updateLocal (newLocal) {
    if (this.isArray(newLocal)) newLocal =  newLocal[0]
    this.locals = (this.locals || [newLocal]).map(local =>
      local._id == newLocal._id ? {...newLocal} : {...local}
    )

    this.setNewEventsState()
  }

  insertEvent (event) {
    if (this.isArray(event)) event =  event[0]
    this.events = this.events? [...this.events, event] : [event]

    this.setNewEventsState()
  }

  updateEvent (newEvent) {
    if (this.isArray(newEvent)) newEvent =  newEvent[0]
    this.events = (this.events || [newEvent]).map(event =>
      event._id == newEvent._id ? {...newEvent} : {...event}
    )

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

  isArray(element) {
    return Array.isArray(element)
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

  groupEventsByLocal(events, sectionSort = this.sortByRoom, sortEvents = this.sortByStart) {

    let eventsArray =
      groupBy(events, 'local')
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
