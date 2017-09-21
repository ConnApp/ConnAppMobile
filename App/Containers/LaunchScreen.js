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

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import Gradient from '../Gradient'
import Mongoose from '../Datastore'
import { styles, colorGradient, colors } from './Styles/LaunchScreenStyles'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

const navigationItems = [
  { categoria: '1', title: 'Programação', navKey: 'Events', bg: colorGradient[1] },
  { categoria: '1', title: 'Agenda',      navKey: 'Events', bg: colorGradient[2] },
  // { categoria: '2', title: 'Informações', navKey: 'Events', bg: colorGradient[3] },
  // { categoria: '2', title: 'Notícias',    navKey: 'Events', bg: colorGradient[4] },
  // { categoria: '2', title: 'Notas',       navKey: 'Events', bg: colorGradient[5] }
]


export default class LaunchScreen extends Component {

  constructor () {
    super()
    this.state = {
      dataSource: ds.cloneWithRows(navigationItems)
    }
  }

  componentWillMount() {
    this.mongo = new Mongoose(['locals', 'eventtypes', 'speakers', 'events'])
  }

  componentDidMount() {
    this.mongo.db.events.sync({fetchAll: true})
      .then(res => {
        return this.mongo.db.eventtypes.sync({fetchAll: true})
      })
      .then(res => {
        return this.mongo.db.locals.sync({fetchAll: true})
      })
      .then(res => {
        return this.mongo.db.speakers.sync({fetchAll: true})
      })
      .then(res => {
        console.log('DONE ALL SYNC')
    })
  }

  goToEvents() {
    this.props.navigation.navigate('Events')
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
              onPress={() => this.goToEvents(item.navKey)}
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
