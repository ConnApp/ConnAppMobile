import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import styles from './Styles/EventCategoryCardStyles'

// <View style={styles.}></View>
export default class EventCategoryCard extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    const oldCategoryName = this.props.title.section.key.split(' - ')
    const newCategoryName = nextProps.title.section.key.split(' - ')
    return (
      oldCategoryName[0] != newCategoryName[0] ||
      oldCategoryName[1] != newCategoryName[1]
    )
  }

  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {this.props.title.section.key.split(' - ')[0]}
          </Text>
        </View>
      </View>
    )
  }
}
