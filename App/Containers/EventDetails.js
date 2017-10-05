import React, { Component } from 'react'
import {
  SectionList,
  Text,
  Image,
  View,
  ScrollView,
  ListView,
  StyleSheet,
  TextInput
} from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'

import Mongoose from '../Datastore'

import {
  flatten,
  capitalize,
  getDurationFromEvent,
  reduceToMarkdownList,
} from '../Helpers'

import TextCard from '../Components/TextCard'
import styles from './Styles/EventDetailsStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class EventDetails extends Component {
  constructor (props) {
    super()
    this.dataOrder = [
      'name',
      'duration',
      'description',
      'local',
      'eventType',
      'speakers',
    ]

    const { event } = props.navigation.state.params
    const eventData = this.getEventDataSet(event, this.dataOrder)
    // console.log(event)
    this.state = {
      event,
      dataOrder: this.dataOrder,
      eventData: ds.cloneWithRows(eventData)
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    // console.log(state)
    if(state.params != undefined){
      return {
        title: `${state.params.event.name}`
      }
    }
  }

  updateEvent() {
    let { name, local, event, eventType, speakers } = this

    event.local = local.name
    event.eventType = eventType.name
    event.speakers = [...speakers].map(speaker => speaker.name)
    event.duration = getDurationFromEvent(event)

    this.setState({
      ...this.state,
      event,
      dataOrder: this.dataOrder,
      eventData: ds.cloneWithRows(this.getEventDataSet(event, this.dataOrder))
    })
  }

  getEventDataSet(event, dataOrder) {
    const array = dataOrder.map(eventName => {
      let data = event[eventName] || eventName
      let isArray = Array.isArray(data)
      let isName = eventName == 'name'

      if (isName) {
        eventName = data
        data = 'nill'
      } else {
        eventName = capitalize(eventName)
      }


      return !isArray? {eventName, data} : {eventName, data: reduceToMarkdownList(data)}
    }).filter(info => info.data)

    return flatten(array)
  }

  componentWillMount(){
    this.mongo = new Mongoose(['events', 'locals', 'eventtypes', 'speakers'])
  }

  componentDidMount() {

    this.mongo.db.locals.on('update', newLocal => {
      this.local = {...newLocal}
      this.updateEvent()
    })

    this.mongo.db.events.on('update', newEvent => {
      this.event = {...newEvent}
      this.updateEvent()
    })

    this.mongo.db.eventtypes.on('update', newEventType => {
      this.eventType = {...newEventType}
      this.updateEvent()
    })

    this.mongo.db.speakers.on('update', newSpeaker => {
      const idArray = this.speakers.map(speaker => speaker._id)

      this.speakers = this.speakers.map(oldSpeaker => {
        let speaker = {...oldSpeaker}
        const index = idArray.indexOf(speaker._id)
        if (index > -1) {
          speaker = {...newSpeaker}
        }
        return speaker
      })

      this.updateEvent()
    })

    const eventQuery = { query: { _id: this.state.event._id } }

    this.mongo.db.events.find(eventQuery)
      .then(dbEvents => {
        this.event = [...dbEvents][0]
        const query = {
          _id: this.event.eventType
        }
        return this.mongo.db.eventtypes.find({ query })
      })
      .then(eventTypes => {
        this.eventType = [...eventTypes][0]
        const query = {
          $or: this.event.speakers.map(speaker => ({ _id: speaker }))
        }
        return this.mongo.db.speakers.find({query})
      })
      .then(speakers => {
        this.speakers = [...speakers]
        const query = {
          _id: this.event.local
        }
        return this.mongo.db.locals.find({ query })
      })
      .then(locals => {
        this.local = [...locals][0]
        this.updateEvent()
      })
      .catch(err => {
        // // console.log(err)
      })
  }

  translateRowName (rowName) {
    // console.log(rowName)
    let name
    switch (rowName) {
      case 'Name':
        name =  'Título'
        break;
      case 'Duration':
        name =  'Horário'
        break;
      case 'Description':
        name =  'Descrição'
        break;
      case 'Local':
        name =  'Sala'
        break;
      case 'EventType':
        name =  'Tipo'
        break;
      case 'Speakers':
        name =  'Palestrantes'
        break;
      default:
        name = rowName
    }

    return name
  }

  renderRow(rowData) {
    const eventName = this.translateRowName(rowData.eventName)
    return <TextCard title={`##**${eventName}**`} text={rowData.data}/>
  }

  render () {
    return (
      <ScrollView>
        <ListView
          dataSource={this.state.eventData}
          renderRow={(rowData) => this.renderRow(rowData)}
          contentContainerStyle={styles.contentContainer}
        />
      </ScrollView>
    )
  }
}
