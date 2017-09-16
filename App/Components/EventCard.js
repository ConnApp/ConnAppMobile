import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from './Styles/EventCardStyles'


// <View style={styles.}></View>
export default class EventCard extends Component {
  getHourFromTimeStamp (timeStamp) {
    const time = new Date(timeStamp)
    let hours = time.getHours() + 3 // Timezone offset. Brazil is GMT+3, hence 3
    let minutes = time.getMinutes()
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`

    return `${hours}:${minutes}`
  }

  getDurantion(event) {
    if (!event.start || !event.end) return ''
    
    const start = this.getHourFromTimeStamp(event.start)
    const end = this.getHourFromTimeStamp(event.end)

    return `${start} - ${end}`
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.event.name != this.props.event.name &&
      nextProps.event.eventType != this.props.event.eventType &&
      getDurantion(nextProps.event) != getDurantion(this.props.event)
    )
  }

  render () {
    // console.log(this.props.event)
    return (
      <View style={styles.contentContainer}>
        <View style={styles.name}>
          <Text style={styles.nameText}>
            {this.props.event.name}
            </Text>
        </View>
        <View style={styles.eventType}>
          <Text style={styles.eventTypeText}>
            {this.props.event.eventType.split(' - ')[0]}
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
                  {this.getDurantion(this.props.event)}
                </Text>
              </View>

            </View>

            <View style={styles.favorite}>
              <View style={styles.favoriteIconContainer}>
                <Icon style={styles.timeStampIconStyle} name="plus" />
              </View>
            </View>

          </View>
          <View style={styles.like}></View>
        </View>

      </View>
    )
  }
}
