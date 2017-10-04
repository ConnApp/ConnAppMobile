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
      imageStyle: props.imageStyle,
      containerStyle: props.containerStyle,
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
    const { size, imageStyle, containerStyle, coverImage } = this.state

    return (
      <View style={[styles.contentContainer, containerStyle]}>
        <View
          style={styles.coverImageContainer}
          onLayout={this.setSize.bind(this)}
        >
          <Image
            resizeMode="cover"
            style={[size, imageStyle]}
            source={coverImage}
          />
        </View>
      </View>
    )
  }
}
