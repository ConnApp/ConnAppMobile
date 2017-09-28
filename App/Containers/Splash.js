import React, { Component } from 'react'

import {
  Image,
  View,
  StyleSheet,
  Text,
  ActivityIndicator
} from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import Gradient from '../Gradient'
import Mongoose from '../Datastore'
import { styles, colorGradient, colors } from './Styles/SplashStyles'

import localEvents      from '../Datastore/mongodb/events.js'
import localEventtypes  from '../Datastore/mongodb/eventtypes.js'
import localSpeakers    from '../Datastore/mongodb/speakers.js'
import localLocals      from '../Datastore/mongodb/locals'

export default class Splash extends Component {

  constructor (props) {
    super()
    this.state = {
      canContinue: false,
      buttonBackground: 'gray',
      statusText: 'Carregando Eventos!'
    }
  }

  shouldSyncFromCloud() {
    console.log(localLocals)
    return new Promise((resolve, reject) => {
      Promise.all(Object.keys(this.mongo.db).map(name => {
        let collection = this.mongo.db[name]
        return collection.count({})
      }))
      .then(counts => {
        const shouldUpdateData = counts.some(count => count > 0)
        resolve(shouldUpdateData)
      })
      .catch(reject)
    })
  }

  componentWillMount() {
    this.mongo = new Mongoose(['events', 'locals', 'eventtypes', 'speakers'])
  }

  syncLocalFiles() {
    let { events, locals, speakers, eventtypes } = this.mongo.db
    const fromRemote = true
    return new Promise((resolve, reject) => {
      events.insert({ data: localEvents, fromRemote })
        .then(res => {
          console.log('Events inserted')
          return locals.insert({ data: localLocals, fromRemote })
        })
        .then(res => {
          console.log('Locals inserted')
          return speakers.insert({ data: localSpeakers, fromRemote })
        })
        .then(res => {
          console.log('Speakers inserted')
          return eventtypes.insert({ data: localEventtypes, fromRemote })
        })
        .then(res => {
          console.log('EventTypes inserted')
          resolve(true)
        })
        .catch(reject)
    })
  }

  navigateTo(screen) {
    setTimeout(() => {
      this.props.navigation.navigate(screen)
    }, 1000)
  }

  componentDidMount() {
    this.shouldSyncFromCloud()
      .then(itShould => {
        return itShould? true : this.syncLocalFiles()
      })
      .then(res => {
        if (res) this.navigateTo('LaunchScreen')
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    return (
      <View style={styles.container}>
        <Image
          style={styles.splashImage}
          source={Images.enegepLogo}
        />
        <ActivityIndicator style={styles.spinner}/>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusText}>Carregando Eventos!</Text>
        </View>
      </View>
    )
  }
}
