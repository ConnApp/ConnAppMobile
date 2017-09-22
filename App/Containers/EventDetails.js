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

import { flatten, capitalize } from '../Helpers'

import TextCard from '../Components/TextCard'
import styles from './Styles/EventDetailsStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class EventDetails extends Component {
  constructor (props) {
    super()
    this.dataOrder = [
      'duration',
      'description',
      'local',
      'eventType',
      'speakers',
    ]

    const { event } = props.navigation.state.params
    const eventData = this.getEventDataSet(event, this.dataOrder)
    console.log(event)
    this.state = {
      event,
      dataOrder: this.dataOrder,
      eventData: ds.cloneWithRows(eventData)
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    console.log(state)
    if(state.params != undefined){
      return {
        title: `${state.params.event.name}`
      }
    }
  }

  getEventDataSet(event, dataOrder) {
    const array = dataOrder.map(eventName => {
      let data = event[eventName] || eventName
      let isArray = Array.isArray(data)
      eventName = capitalize(eventName)
      return !isArray? {eventName, data} : {eventName, data: this.reduceToList(data)}
    }).filter(info => info.data)

    return flatten(array)
  }

  componentWillMount(){

  }

  componentDidMount() {

  }

  reduceToList(data) {
    return data.reduce((finalArray, item) => {
      finalArray.push(`* ${item}`)
      return finalArray
    }, []).join('\n')
  }

  translateRowName (rowName) {
    console.log(rowName)
    let name
    switch (rowName) {
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
    }

    return name
  }

  renderRow(rowData) {
    const eventName = this.translateRowName(rowData.eventName)
    return <TextCard title={`##**${eventName}**`} text={`${rowData.data}`}/>
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
