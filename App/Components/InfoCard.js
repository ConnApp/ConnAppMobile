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
import styles from './Styles/InfoCardStyles'
import LocalStorage from '../Datastore/LocalStorage'
import Datastore from '../Datastore'


// <View style={styles.}></View>
export default class InfoCard extends Component {

  constructor(props) {
    super()
    this.state = {
      info: {
        ...props.info,
      }
    }
  }

  componentWillMount() {
    this.mongo = new Datastore(['info'])
  }

  setInfo(info) {
    this.setState({
      ...this.state,
      info,
    })
  }

  componentDidMount() {
    this.mongo.db.info.on('update', newInfo => {
      if (newInfo[0]._id == this.state.info._id) {
        this.setInfo(newInfo[0])
      }
    })

    this.mongo.db.info.on('logicalRemove', newInfo => {
      if (newInfo[0]._id == this.state.info._id) {
        this.props.removeItself(newInfo[0])
      }
    })

    const query = {
      _id: this.state.info._id
    }

    this.mongo.db.info.find({ query })
      .then(res => {
        if (res.length) this.setInfo(res[0])
      })
      .catch(err => {
        console.log(err)
      })
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate =
      nextState.info.title != this.state.info.title ||
      nextState.info.createAt != this.state.info.createAt

    if (typeof shouldUpdate === 'undefined') {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      info: nextProps.info,
    })
  }

  openInfoDetail() {
    this.props.navigation.navigate('InfoDetails', {info: this.state.info})
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
        <View style={styles.bottomContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              {this.state.info.title}
            </Text>
          </View>
        </View>
      </View>
    )

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={() => this.openInfoDetail()}>
          {mainView}
        </TouchableNativeFeedback>
      )
    } else {
       return (
        <TouchableHighlight
          underlayColor='#00000010'
          onPress={() => this.openInfoDetail()}>
          {mainView}
        </TouchableHighlight>
      )
    }
  }
}
