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
import ImageCover from './ImageCover'
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

    const query = {
      _id: this.state.news._id
    }

    this.mongo.db.news.find({ query })
      .then(res => {
        if (res.length) this.setNews(res[0])
      })
      .catch(err => {
        console.log(err)
      })
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate =
      nextState.news.title != this.state.news.title ||
      nextState.news.cover != this.state.news.cover ||
      nextState.news.createAt != this.state.news.createAt

    if (typeof shouldUpdate === 'undefined') {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      news: nextProps.news,
    })
  }

  openNewsDetail() {
    this.props.navigation.navigate('NewsDetails', {news: this.state.news})
  }

  formatTitle(title, limit = 64) {
    if (!title) return 'Sem título'
    if (title.length >= limit + 3) {
      title = `${title.substring(0, limit)}...`
    }

    return title
  }

  render () {
    const mainView = (
      <View style={styles.contentContainer}>
        <ImageCover image={this.state.news.cover}/>
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
