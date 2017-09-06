import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images } from '../Themes'
import { Button } from 'react-native-elements'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

const colors = {
  initialColor: '#054D73',
  finalColor: '#5FA7CD',
  steps: 6
}

const events = [

]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.initialColor
  },
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerImage: {
    flex: 1,
    marginTop: 0,
    width: 300,
    resizeMode: 'contain'
  },
})

export default class Events extends Component {
  constructor () {
    super()
    this.state = {
      events: ds.cloneWithRows(events)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={Images.enegepLogo}
          />
        </View>
      </View>
    )
  }
}
