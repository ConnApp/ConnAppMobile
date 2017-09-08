import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import styles from './Styles/EventCategoryCardStyles'

// <View style={styles.}></View>
export default class EventCategoryCard extends Component {
  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {this.props.title.section.key}
          </Text>
        </View>
      </View>
    )
  }
}
