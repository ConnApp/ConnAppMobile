import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  Image,
  View,
} from 'react-native'

import { Fonts, Colors, Metrics, Images } from '../Themes/'

import styles from './Styles/ImageCoverStyles'

// <View style={styles.}></View>
export default class ImageCover extends Component {

  constructor(props) {
    super()
    this.state = {
      size: {
        width: 0,
        height: 0,
      },
      coverImage: props.image? { uri: props.image } : Images.newsPlaceholder
    }
  }

  setSize(event){
		const width = event.nativeEvent.layout.width;
		const height = event.nativeEvent.layout.height;
		this.setState({
      ...this.state,
      size: {
        width,
        height,
      }
    });
	}

  componentWillMount() {

  }

  componentDidMount() {

  }

  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  render () {
    return (
      <View style={styles.contentContainer}>
        <View
          style={styles.coverImageContainer}
          onLayout={this.setSize.bind(this)}
        >
          <Image
            resizeMode="cover"
            style={this.state.size}
            source={this.state.coverImage}
          />
        </View>
      </View>
    )
  }
}
