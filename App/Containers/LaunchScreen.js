import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import wamp from 'wamp.js2'
const ws = new wamp.Connection({
  url: 'ws://104.236.15.64:8080/ws',
  realm: 'realm1'
})

import { Images } from '../Themes'
import Mongoose  from '../Datastore'
var mongo = new Mongoose()
console.log(mongo)
// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor() {
    super()
    mongo.testFind()
    this.state = {
      counter: 0
    }
  }
  componentWillMount () {
    ws.onopen = (session) => {
      console.log('connection openned - WAMP.JS')
      session.subscribe('com.example.counter', (data) => {
        this.updateCounter(data[0])
      })
    }
    ws.onclose = (session) => {
      console.log('connection close - WAMP.JS')
    }
    ws.open()
  }
  updateCounter (newCounter) {
    this.setState({
      counter: newCounter
    })
  }
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>

          <View style={styles.section} >
            <Text style={styles.sectionText}>
              `This is an WAMP counter text`
            </Text>
            <Text style={styles.sectionText}>
              {this.state.counter}
            </Text>
          </View>

          <DevscreensButton />
        </ScrollView>
      </View>
    )
  }
}
