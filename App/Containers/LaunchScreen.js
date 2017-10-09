import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  Image,
  View,
  ListView,
  StyleSheet,
  NetInfo
} from 'react-native'

import { NavigationActions } from 'react-navigation'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import Gradient from '../Gradient'
import Mongoose from '../Datastore'
import { styles, colorGradient, colors } from './Styles/LaunchScreenStyles'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

// const collectionArray = ['places', 'eventtypes', 'speakers', 'events', 'news', 'info']
// const collectionArray = ['events']

const navigationItems = [
  { categoria: '1', title: 'Programação', navKey: 'Events', bg: colorGradient[1] },
  { categoria: '1', title: 'Agenda', navKey: 'Agenda', bg: colorGradient[2] },
  { categoria: '2', title: 'Notícias', navKey: 'News', bg: colorGradient[3] },
  { categoria: '2', title: 'Informações', navKey: 'Info', bg: colorGradient[4] }
  // { categoria: '2', title: 'Notas',       navKey: 'Notes', bg: colorGradient[5] }
]

export default class LaunchScreen extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dataSource: ds.cloneWithRows(navigationItems)
    }
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  handlePress (navKey) {
    let that = this
    switch (navKey) {
      case 'Events':
        that.goToEvents()
        break
      case 'Agenda':
        that.goToAgenda()
        break
      case 'News':
        that.goToNews()
        break
      case 'Info':
        that.goToInfo()
        break
      default:

    }
  }

  goToEvents () {
    this.props.navigation.navigate('Events')
  }

  goToAgenda () {
    this.props.navigation.navigate('Events', {fetchOnlyAgenda: true})
  }

  goToNews () {
    this.props.navigation.navigate('News')
  }

  goToInfo () {
    this.props.navigation.navigate('Info')
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={Images.enegepLogo}
          />
        </View>
        <View style={styles.menuList}>
          {navigationItems.map((item, key) => (
            <Button
              key={key}
              onPress={() => this.handlePress(item.navKey)}
              containerViewStyle={styles.menuButtonView}
              buttonStyle={styles.menuButton}
              backgroundColor={item.bg}
              title={item.title}
            />
          ))}
        </View>
      </View>
    )
  }
}
