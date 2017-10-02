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

import { getHourFromTimeStamp, getCompleteDate } from '../Helpers'
import styles from './Styles/NewsCardStyles'
import LocalStorage from '../Datastore/LocalStorage'
import Datastore from '../Datastore'


// <View style={styles.}></View>
export default class NewsCard extends Component {

  constructor(props) {
    super()
    this.state = {
      news: {
        ...props.news,
      }
    }
  }

  componentWillMount() {
    this.mongo = new Datastore(['news'])
  }

  componentDidMount() {

  }

  shouldComponentUpdate (nextProps, nextState) {
    return true
  }
  openNewsDetail() {
    // this.props.navigation.navigate('EventDetails', {event: this.state.event})
  }

  formatTitle(title, limit = 64) {

    if (title.length >= limit + 3) {
      title = `${title.substring(0, limit)}...`
    }

    return title
  }

  render () {
    const mainView = (
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {this.formatTitle(this.state.news.title)}
          </Text>
        </View>
        <View style={styles.newsTextContainer}>
          <Text style={styles.newsText}>
            {this.formatTitle(this.state.news.text, 200)}
          </Text>
        </View>
        <View style={styles.timeStampContainer}>
          <Text style={styles.timeStampText}>
            {getCompleteDate(this.state.news.time)}
          </Text>
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
