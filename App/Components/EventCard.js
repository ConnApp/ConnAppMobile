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


// <View style={styles.}></View>
export default class EventCard extends Component {

  constructor(props) {
    super()
    this.state = {
      isFavorite: false,
    }
    this.state = {
      event: {
        ...props.event,
        local: (props.event.local || '').split(' - ')[0],
        eventType: (props.event.eventType || '').split(' - ')[0],
        duration: getDurationFromEvent(props.event)
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState.isFavorite != this.state.isFavorite ||
      nextProps.event.name != this.state.event.name ||
      nextProps.event.eventType != this.state.event.eventType ||
      getDurationFromEvent(nextProps.event) != getDurationFromEvent(this.state.event)
    )
  }

  getIcon() {
    return this.state.isFavorite? 'check' : 'plus'
  }

  favoritePress() {
    const nextState = !this.state.isFavorite
    // console.log(nextState)
    this.setState({
      isFavorite: nextState
    })
  }

  openEventDetail() {
    this.props.navigation.navigate('EventDetails', {event: this.state.event})
  }

  render () {
    const mainView = (
      <View style={styles.contentContainer}>
        <View style={styles.name}>
          <Text style={styles.nameText}>
            {this.state.event.name}
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
        <TouchableHighlight onPress={() => this.openEventDetail()}>
          {mainView}
        </TouchableHighlight>
      )
    }
  }
}
