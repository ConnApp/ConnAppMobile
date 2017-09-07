import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import EventCard from '../Components/EventCard'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

const events = [
  { title: 'Palestra teste', place: 'Lírio - 1', start: '11:15', end: '11:55', likes: 'Sala Teste'},
  { title: 'Test Tile2', place: 'Place 2', start: '12:15', end: '12:55', likes: 'Sala Teste'},
  { title: 'Test Tile3', place: 'Place 3', start: '13:15', end: '13:55', likes: 'Sala Teste'},
  { title: 'Test Tile4', place: 'Place 4', start: '14:15', end: '14:55', likes: 'Sala Teste'},
  { title: 'Test Tile5', place: 'Place 5', start: '15:15', end: '15:55', likes: 'Sala Teste'},
]

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    backgroundColor: '#efefef'
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

  componentWillMount() {
    // Find mongo this.props.navigation.state.routeName
    console.log('-----------------------------------')
    console.log(this.props.navigation.state.routeName)
  }

  render () {
    return (
      <View contentContainerStyle={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {events.map((event, key) => (
            <EventCard key={key} event={event} />
          ))}
        </ScrollView>
      </View>
    )
  }
}
