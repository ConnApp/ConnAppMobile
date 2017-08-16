 import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

import { Images } from '../Themes'
import Mongoose  from '../Datastore'
import WAMP  from '../WAMP'
let mongo = new Mongoose()
let ws

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor() {
    super()
    this.state = {
      counter: 0
    }
  }
  componentWillMount () {
    const subArray = [
      {
        uri: 'conapp.fakenews.fetch.insert',
        cb: (data) => {
          console.log(data)
          this.updateCounter(data[0].data._id.toString())
        }
      }
    ]
    // ws = new WAMP({subArray})

    ws = new WAMP({subArray})
    console.log(ws)
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
