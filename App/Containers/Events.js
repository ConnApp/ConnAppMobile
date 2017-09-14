import React, { Component } from 'react'
import { SectionList, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import EventCard from '../Components/EventCard'
import EventCategoryCard from '../Components/EventCategoryCard'
import Mongoose from '../Datastore'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})
let mongo = new Mongoose(['events'])

const events = [{
  key:  '',
  data: [],
}]

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    backgroundColor: '#efefef'
  },
  category: {
    borderTopColor: '#efefef',
    borderLeftColor: '#efefef',
    borderRightColor: '#efefef',
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5,
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
      events: [{
        key:  'Carregando...',
        data: [],
      }]
    }
  }

  componentWillMount() {
    mongo.db.events.on('insert', (data) => {
      // console.log(data)
    })

    mongo.db.events.on('update', (data) => {

    })
    const today = parseInt(this.props.navigation.state.key.split(' ')[1])

    const queryTest = {
      dateQuery: this.getTodayFilter()
    }

    mongo.db.events.sync(queryTest)
      .then(dbEvents => {
        // console.log(dbEvents)
        this.groupByLocal(dbEvents)
      })
      .catch(err => {
        // console.log(err)
      })
  }

  getTodayFilter() {
    const day = parseInt(this.props.navigation.state.key.split(' ')[1])
    return {
      start: { $gt: new Date(2017, 9, day, 0, 0, 0) },
      end: { $lt: new Date(2017, 9, day + 1, 0, 0, 0)}
    }
  }

  groupByLocal(dbEvents) {
    let eventsArray = []
    let cacheIndex = {}
    dbEvents.forEach(event => {
      let data = { name: event.name, start: event.start, end: event.end }
      if (!(cacheIndex[event.local] || {}).index) {
        eventsArray.push({
          key: event.local,
          data: [data]
        })
        cacheIndex[event.local] = { index: eventsArray.length, data: {} }
        cacheIndex[event.local].data[event._id] = 1
      } else {
        let keyIndex = cacheIndex[event.local].index - 1
        if (cacheIndex[event.local].data[event._id]) {
          let dataIndex = cacheIndex[event.local].data[event._id] - 1
          eventsArray[keyIndex].data[dataIndex] = data
        } else {
          eventsArray[keyIndex].data.push(data)
          cacheIndex[event.local].data[event._id] = eventsArray[keyIndex].data.length
        }
      }
    })

    this.setState({
      events: eventsArray
    })
    // console.log(this.state.events)
  }

  renderCard (event) {
    return <EventCard event={event.item} />
  }
  renderHeader (title) {
    return (
      <View style={styles.category}>
        <EventCategoryCard title={title} />
      </View>
    )
  }

  render () {
    return (
      <View contentContainerStyle={styles.contentContainer}>
        <SectionList
          keyExtractor={(item, index) => index}
          stickySectionHeadersEnabled={true}
          renderItem={this.renderCard}
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.scrollView}
          sections={this.state.events}
        />
      </View>
    )
  }
}
