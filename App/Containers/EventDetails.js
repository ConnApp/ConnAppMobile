import React, { Component } from 'react'
import {
  SectionList,
  Text,
  Image,
  View,
  ListView,
  StyleSheet,
  TextInput
} from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'

import Mongoose from '../Datastore'

import { groupBy } from '../Helpers'

import styles from './Styles/EventDetailsStyles'

export default class EventDetails extends Component {
  constructor (props) {
    super()
    this.state = {
      event: props.navigation.state.params.event
    }
    this.mongo = new Mongoose(['events', 'locals', 'eventtypes', 'speakers'])
  }

  componentWillMount(){
    console.log(this.state.event)
  }

  componentDidMount() {

  }


  render () {
    return (
      <View contentContainerStyle={styles.contentContainer}>

      </View>
    )
  }
}
