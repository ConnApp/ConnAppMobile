import React, { Component } from 'react'

import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import Gradient from '../Gradient'
import Mongoose from '../Datastore'
import { styles, colorGradient, colors } from './Styles/SplashStyles'


export default class Splash extends Component {

  constructor () {
    super()
    this.state = {
      canContinue: false
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Image
          style={styles.splashImage}
          source={Images.enegepLogo}
        />
        <ActivityIndicator style={styles.spinner} />
      </View>
    )
  }
}
