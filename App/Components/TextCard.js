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

import styles from './Styles/TextCardStyles'


// <View style={styles.}></View>
export default class TextCard extends Component {
  render () {
    return (
      <View contentContainerStyle={styles.contentContainer}>
        <Markdown style={styles.markdownStyle}>
          {this.props.title+'\n\n' + this.props.text || ''}
        </Markdown>
      </View>
    )
  }
}
