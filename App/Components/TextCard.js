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
} from 'react-native'
import { Button } from 'react-native-elements'
import { Fonts, Colors, Metrics } from '../Themes/'
import Icon from 'react-native-vector-icons/FontAwesome'
import Markdown from 'react-native-easy-markdown'
import ImageCover from './ImageCover'

import styles from './Styles/TextCardStyles'


// <View style={styles.}></View>
export default class TextCard extends Component {
  constructor(props) {
    super()
    let { text, title } = props

    if (text == 'nill') {
      text = ''
    }

    if (title == 'nill') {
      title = ''
    }

    this.markdownStyle = {
      imageWrapper: {
        width: 250,
        flex: 1
      }
    }

    this.state = {
      text,
      title
    }
  }

  componentWillReceiveProps(props) {
    let { text, title } = props

    if (text == 'nill') {
      text = ''
    }

    if (title == 'nill') {
      title = ''
    }

    this.setState({
      text,
      title,
    })
  }

  shouldComponentUpdate() {
    return true
  }

  render () {
    return (
      <View contentContainerStyle={styles.contentContainer}>
        <Markdown markdownStyles={this.markdownStyle} style={styles.markdownStyle}>
          {this.state.title+'\n\n' + this.state.text || ''}
        </Markdown>
      </View>
    )
  }
}
