import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  Text,
  Image,
  View,
  ListView,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native'

import { Button } from 'react-native-elements'
import { Fonts, Colors, Metrics } from '../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'

import { getDurationFromEvent } from '../Helpers'
import styles from './Styles/EventCardStyles'
import LocalStorage from '../Datastore/LocalStorage'


// <View style={styles.}></View>
export default class EventCard extends Component {

  constructor(props) {
    super()
    this.state = {
      isAgenda: false,
      event: {
        ...props.event,
        local: (props.event.local || '').split(' - ')[0],
        eventType: (props.event.eventType || '').split(' - ')[0],
        duration: getDurationFromEvent(props.event)
      }
    }
  }

  componentWillMount() {
    this.localAgendaStorage = new LocalStorage('agenda')
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.event.isAgenda != this.state.event.isAgenda ||
      nextProps.event.name != this.state.event.name ||
      nextProps.event.eventType != this.state.event.eventType ||
      getDurationFromEvent(nextProps.event) != getDurationFromEvent(this.state.event)
    )
  }

  getIcon() {
    return this.state.event.isAgenda? 'check' : 'plus'
  }

  favoritePress() {
    const nextState = !this.state.event.isAgenda

    const data = {
      value: this.state.event._id
    }

    const query = {
      value: this.state.event._id
    }

    this.localAgendaStorage.on('remove', numRemoved => {
      setTimeout(() => {
        this.props.updateParent()
      }, 1000)
    })

    let promise = nextState?
      this.localAgendaStorage.insert({ data }) :
      this.localAgendaStorage.remove({ query })


    promise
      .then(res => {
        // console.log(res)
        this.setState({
          ...this.state,
          event: {
            ...this.state.event,
            isAgenda: nextState
          }
        })

      })
      .catch(err => {
        // console.log(err)
      })

  }

  openEventDetail() {
    this.props.navigation.navigate('EventDetails', {event: this.state.event})
  }

  formatTitle(title) {
    const limit = 64
    if (title.length >= limit + 3) {
      title = `${title.substring(0, limit)}...`
    }

    return title
  }

  render () {
    const mainView = (
      <View style={styles.contentContainer}>
        <View style={styles.name}>
          <Text style={styles.nameText}>
            {this.formatTitle(this.state.event.name)}
          </Text>
        </View>
        <View style={styles.eventType}>
          <Text style={styles.eventTypeText}>
            {this.state.event.eventType + ' ' + (this.state.event.order || '')}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.time}>

            <View style={styles.timeStamp}>
              <View style={styles.timeStampIconContainer}>
                <Icon style={styles.timeStampIconStyle} name="clock-o" />
              </View>
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeTextStyle}>
                  {this.state.event.duration}
                </Text>
              </View>
            </View>
            <TouchableHighlight
              underlayColor="#d7d7d7"
              onPress={() => this.favoritePress()}
              style={styles.favorite}>
                <View style={styles.favoriteIconContainer}>
                  <Icon
                    style={styles.timeStampIconStyle}
                    name={(() => this.getIcon())()}
                  />
                </View>
            </TouchableHighlight>
          </View>
          <View style={styles.like}></View>
        </View>
      </View>
    )
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={() => this.openEventDetail()}>
          {mainView}
        </TouchableNativeFeedback>
      )
    } else {
       return (
        <TouchableHighlight
          underlayColor='#00000010'
          onPress={() => this.openEventDetail()}>
          {mainView}
        </TouchableHighlight>
      )
    }
  }
}
