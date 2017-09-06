import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'

// import styles from './Styles/EventCardStyles'

const colors = {
  initialColor: '#054D73',
  finalColor: '#5FA7CD',
  steps: 6
}

const styles = StyleSheet.create({
  contentContainer: {
    height: 100,
    margin: 15,
    padding: 10,
    elevation: 5,
    backgroundColor: 'white'
  },
  title: {
    flex: 1,
    justifyContent: 'center'
  },
  titleText: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.input,
    fontWeight: 'bold',
  },
  place: {
    flex: 2,
    justifyContent: 'center'
  },
  placeText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    fontWeight: 'normal',
  },
  timeContainer: {
    flex: 2,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  time: {
    flex: 2,
    flexDirection: 'row'
  },
  timeStamp: {
    flex: 4,
    marginRight: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 4
  },
  timeStampIconContainer: {
    flex: 1,
    fontSize: 19,
    alignItems: 'center',
    color: colors.finalColor
  },
  timeStampIconStyle: {
    fontSize: 24,
    color: colors.finalColor
  },
  timeTextContainer: {
    flex: 4,
    alignItems: 'center',
    color: colors.finalColor
  },
  timeTextStyle: {
    fontSize: 16,
    color: colors.finalColor
  },
  favorite: {
    flex: 1,
    marginLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 4
  },
  favoriteIconContainer: {
    flex: 1,
    fontSize: 19,
    alignItems: 'center',
    color: colors.finalColor
  },
  favoriteIconStyle: {
    fontSize: 24,
    color: colors.finalColor
  },
  like: {
    flex: 2
  },
})

// <View style={styles.}></View>
export default class EventCard extends Component {

  render () {
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
