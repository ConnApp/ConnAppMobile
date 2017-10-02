import React, { Component } from 'react'
import {
  SectionList,
  Text,
  Image,
  View,
  ListView,
  StyleSheet,
  TextInput,
  Platform
} from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'

import EventCard from '../Components/EventCard'
import EventCategoryCard from '../Components/EventCategoryCard'
import Mongoose from '../Datastore'
import LocalStorage from '../Datastore/LocalStorage'

import { groupBy, toMongoIdObject } from '../Helpers'

import styles from './Styles/EventsStyles'

const device = Platform.OS

const events = [{
  key:  'Carregando Salas',
  data: [],
}]

class SearchBar extends Component {
  constructor(props) {
    super()
  }

  render() {
    return (
      <TextInput
        onChangeText={text => {
          this.props.filter.filterEventsBy({text})
        }}
        style={styles.searchBar}
        selectionColor="#FFFFFFD5"
        underlineColorAndroid="#FFFFFFD5"
        placeholderTextColor="gray"
        placeholder="Buscar Eventos" />
    )
  }
}

export default class Events extends Component {
  constructor () {
    super()
    this.state = {
      events: []
    }
    this.mongo = new Mongoose(['events', 'locals', 'eventtypes', 'speakers'])
    this.localAgendaStorage = new LocalStorage('agenda')
    this.localLikesStorage = new LocalStorage('likes')
    this.events = []
    this.eventtypes = []
    this.locals = []
  }

  componentWillMount(){
    const {setParams} = this.props.navigation;
    setParams({
      filterEventsBy: ({text}) => {
        this.filterBy({text})
      }
    })
  }

  filterBy({text = ''}) {
    this.currentFilter = text
    const query = {
      name: this.currentFilter
    }
    this.fetchEvents({query})
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation

    let title = (state.params || {}).fetchOnlyAgenda? 'Minha Agenda' : 'Programação'

    let navItems = {
      headerTitle: title,
    }

    if ( state.params != undefined && device == 'android' ){
      navItems.headerRight = <SearchBar filter={state.params} />
    }

    return navItems
  }

  setNewEventsState (query = {}) {
    let eventTypes = this.reduceToId(this.eventTypes)
    let locals = this.reduceToId(this.locals)
    let localAgendaIds = this.localAgenda.map(res => res.value)
    let localLikesIds = this.localLikes.map(res => res.value)
    let events = this.events.map(eventRef => {
      let event = {...eventRef}
      event.isAgenda = localAgendaIds.indexOf(event._id) > -1
      event.isLiked = localLikesIds.indexOf(event._id) > -1
      event.local = locals[event.local]
      event.eventType = eventTypes[event.eventType]
      return event
    })

    if (query.name) {
      events = events.filter(event => {
        const hasEventType = event.eventType.toLowerCase().indexOf(query.name.toLowerCase()) > -1
        const hasEventName = event.name.toLowerCase().indexOf(query.name.toLowerCase()) > -1
        const hasEventLocal = event.local.toLowerCase().indexOf(query.name.toLowerCase()) > -1
        return hasEventName || hasEventType || hasEventLocal
      })
    }

    this.groupEventsByLocal(events)
  }

  insertIntoList (item = undefined, list = undefined) {
    if (!list || !item) throw new Error('Provide list and item')

    if (this.isArray(item)) item =  item[0]
    this[list] = this[list]? [...this[list], {...item}] : [{...item}]

    this.setNewEventsState()
  }

  updateListItem (item = undefined, list = undefined) {
    if (!list || !item) throw new Error('Provide list and item')

    if (this.isArray(item)) item =  item[0]

    this[list] = (this[list] || [item]).map(listItem => {
      let isItem = listItem._id == item._id
      return isItem ? {...item} : {...listItem}
    })

    const query = {
      name: this.currentFilter || ''
    }

    this.setNewEventsState(query)
  }

  componentDidMount() {
    this.mongo.db.locals.on('insert', newLocal => {
      this.insertIntoList(newLocal, 'locals')
    })

    this.mongo.db.events.on('insert', newEvent => {
      this.insertIntoList(newEvent, 'events')
    })

    this.mongo.db.locals.on('update', newLocal => {
      this.updateListItem(newLocal, 'locals')
    })

    // this.mongo.db.events.on('update', newEvent => {
    //   this.updateListItem(newEvent, 'events')
    // })

    this.mongo.db.eventtypes.on('update', newEventType => {
      this.updateListItem(newEventType, 'eventTypes')
    })

    this.fetchEvents({})
  }

  fecthLocalData() {
    return Promise.all([
      this.localAgendaStorage.find({}),
      this.localLikesStorage.find({}),
    ])
  }

  fetchEvents ({ query = {} }) {
    const { state } = this.props.navigation
    let mQuery = { dateQuery: this.getTodayFilter() }
    this.fecthLocalData()
      .then(localData => {
        this.localAgenda = [...localData[0]]
        this.localLikes = [...localData[1]]

        if ((state.params || {}).fetchOnlyAgenda === true) {
          mQuery.query = {
            $or: this.localAgenda.length?
              this.localAgenda.map(res => ({_id: res.value})) : []
          }
        }

        return this.mongo.db.events.find(mQuery)
      })
      .then(dbEvents => {
        this.events = [...dbEvents]
        return this.mongo.db.eventtypes.find({})
      })
      .then(eventTypes => {
        this.eventTypes = [...eventTypes]
        return this.mongo.db.locals.find({})
      })
      .then(locals => {
        this.locals = [...locals]
        this.setNewEventsState(query)
      })
      .catch(err => {
        // // console.log(err)
      })
  }

  isArray(element) {
    return Array.isArray(element)
  }

  reduceToId (docs) {
    // console.log(docs)
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
    // // console.log(this.state.events)
  }

  getLocalName(localId) {
    let locals = this.reduceToId(this.locals)
    return locals[localId].split(' - ')[0]
  }

  getEventtypeName(eventtype) {
    let eventtypes = this.reduceToId(this.eventTypes)
    return eventtypes[eventtype].split(' - ')[0]
  }

  getSpeakersName(speakersIds) {

  }

  renderCard (event) {
    // console.log(test)
    return (
      <EventCard
        getLocalName={this.getLocalName.bind(this)}
        getEventtypeName={this.getEventtypeName.bind(this)}
        mongo={this.mongo}
        updateParent={() => this.fetchEvents({})}
        navigation={this.props.navigation}
        event={event.item}
      />
    )
  }

  renderHeader (title) {
    return (
      <View style={styles.category}>
        <EventCategoryCard title={title} />
      </View>
    )
  }

  render () {
    const ListItems = (
      <SectionList
        keyExtractor={(item, index) => item._id}
        renderItem={this.renderCard.bind(this)}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={this.renderHeader}
        contentContainerStyle={styles.scrollView}
        sections={this.state.events}
      />
    )

    const finalView = (device == 'android') ?
      (<View contentContainerStyle={styles.contentContainer}>
        {ListItems}
      </View>) :
      (<View contentContainerStyle={styles.contentContainer}>
        <SearchBar filter={this.props.navigation.state.params} />
        {ListItems}
      </View>)

    return finalView
  }
}
