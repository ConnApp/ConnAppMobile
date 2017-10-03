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
import { Fonts, Images, Colors, Metrics } from '../Themes/'
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

  setNews(news) {
    this.setState({
      ...this.state,
      news,
    })
  }

  componentDidMount() {
    this.mongo.db.news.on('update', newNews => {
      if (newNews._id == this.state.news._id) {
        this.setNews(newNews)
      }
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  openNewsDetail() {
    // this.props.navigation.navigate('EventDetails', {event: this.state.event})
  }

  formatTitle(title, limit = 64) {
    if (!title) return 'Sem título'
    if (title.length >= limit + 3) {
      title = `${title.substring(0, limit)}...`
    }

    return title
  }

  render () {

    const coverImage = this.state.news.cover?
      {uri: this.state.news.cover} : Images.enegepLogoOld
    const mainView = (
      <View style={styles.contentContainer}>

        <View style={styles.coverImageContainer}>
          <Image
            resizeMode="cover"
            style={styles.coverImage}
            source={coverImage}
          />
        </View>

        <View style={styles.bottomContainer}>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              {this.formatTitle(this.state.news.title)}
            </Text>
          </View>

          <View style={styles.timeStampContainer}>
            <Text style={styles.timeStampText}>
              {getCompleteDate(this.state.news.createAt)}
            </Text>
          </View>

        </View>

      </View>
    )
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={() => this.openNewsDetail()}>
          {mainView}
        </TouchableNativeFeedback>
      )
    } else {
       return (
        <TouchableHighlight
          underlayColor='#00000010'
          onPress={() => this.openNewsDetail()}>
          {mainView}
        </TouchableHighlight>
      )
    }
  }
}
