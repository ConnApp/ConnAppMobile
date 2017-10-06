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
import Datastore from '../Datastore'


// <View style={styles.}></View>
export default class EventCard extends Component {

  constructor(props) {
    super()
    this.state = {
      isAgenda: false,
      favoritePressIsDone: true,
      event: {
        ...props.event,
        likes: props.event.likes? props.event.likes : 0,
        likeColor: props.event.isLiked? Colors.primaryLight : 'gray',
        place: (props.event.place || '').split(' - ')[0],
        eventType: (props.event.eventType || '').split(' - ')[0],
        duration: getDurationFromEvent(props.event)
      }
    }
    this.mongo = props.mongo
    this.likePressIsDone = true
  }

  componentWillMount() {
    this.localAgendaStorage = new LocalStorage('agenda')
    this.localLikesStorage = new LocalStorage('likes')
  }

  componentDidMount() {
    this.mongo.db.events.on('update', newEvent => {
      if (newEvent[0]._id == this.state.event._id) {
        this.setState({
          ...this.state,
          event: {
            ...this.state.event,
            ...newEvent[0],
            place: this.props.getPlaceName(newEvent[0].place),
            eventType: this.props.getEventtypeName(newEvent[0].eventType),
            // local: this.props.getSpeakersName(newEvent[0].speakers)
          }
        })
      }
    })
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate =
      nextState.event.likes != this.state.event.likes ||
      nextState.event.eventType != this.state.event.eventType ||
      nextState.event.name != this.state.event.name ||
      nextState.event.isLiked != this.state.event.isLiked ||
      nextState.event.isAgenda != this.state.event.isAgenda ||
      getDurationFromEvent(nextProps.event) != getDurationFromEvent(this.state.event)

    return shouldUpdate
  }

  getIcon() {
    return this.state.event.isAgenda? 'check' : 'plus'
  }

  likePress() {
    if (!this.likePressIsDone) return false

    let { event } = this.state

    const nextState = !event.isLiked

    const data = {
      value: event._id
    }

    const query = {
      value: event._id
    }

    let promise = nextState?
      this.localLikesStorage.insert({ data }) :
      this.localLikesStorage.remove({ query })

    promise
      .then(res => {

        const query = {
          _id: event._id
        }

        const setDataOver = {
          $inc: {
            likes: nextState? 1 : -1
          }
        }

        return this.mongo.db.events.update({ query, data, setDataOver })
      })
      .then(res => {
        this.setState({
          ...this.state,
          event: {
            ...event,
            likes: res.newDocs[0].likes,
            likeColor: nextState? Colors.primaryLight : 'gray',
            isLiked: nextState
          }
        })

        this.likePressIsDone = true
      })
      .catch(err => {
        // console.log(err)
      })

  }

  favoritePress() {
    if (!this.state.favoritePressIsDone) return false

    this.setState({
      ...this.state,
      favoritePressIsDone: false
    })

    const nextState = !this.state.event.isAgenda

    const data = {
      value: this.state.event._id
    }

    const query = {
      value: this.state.event._id
    }

    let promise = nextState?
      this.localAgendaStorage.insert({ data }) :
      this.localAgendaStorage.remove({ query })

    promise
      .then(res => {

        this.setState({
          ...this.state,
          favoritePressIsDone: true,
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
          <View style={styles.likeWrapper}>
            <TouchableHighlight
              underlayColor="#d7d7d700"
              onPress={() => this.likePress()}
            >
              <View
                style={styles.like}>
                <Text
                  style={[
                    styles.likeTextStyle,
                    {color: this.state.event.likeColor}
                  ]}
                >
                  {this.state.event.likes || 0}
                </Text>
                <Icon
                  style={[
                    styles.likeIconStyle,
                    {color: this.state.event.likeColor}
                  ]}
                  name='thumbs-o-up'
                />
              </View>
            </TouchableHighlight>
          </View>
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
