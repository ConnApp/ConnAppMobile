import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'

import styles from './Styles/EventCardStyles'


// <View style={styles.}></View>
export default class EventCard extends Component {
  render () {
    // console.log(this.props.event)
    return (
      <View style={styles.contentContainer}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {this.props.event.title}
            </Text>
        </View>
        <View style={styles.place}>
          <Text style={styles.placeText}>
            {this.props.event.place}
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
                  {`${this.props.event.start} - ${this.props.event.end}`}
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
