import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import AppNavigation from '../Navigation/AppNavigation'
import ServicesController from './ServicesController'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  render () {
    return (
      <View style={styles.applicationView}>
        <ServicesController />
        <StatusBar
          backgroundColor="#054D73"
          barStyle="light-content"
        />
        <AppNavigation />
      </View>
    )
  }
}

export default RootContainer
