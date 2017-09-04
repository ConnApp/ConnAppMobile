import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images } from '../Themes'
import { Button } from 'react-native-elements'


const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})


const navigationItems = [
  { title: 'Programação', bg: '#65BAF7' },
  { title: 'Agenda', bg: '#8AB2C0' },
  { title: 'Informações', bg: '#AFAB89' },
  { title: 'Notícias', bg: '#D4A352' },
  { title: 'Notas', bg: '#F99C1B' }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#122C34'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerImage: {
    marginTop: 5
  },
  menuList: {
    flex: 4,
    marginLeft: -15,
    marginRight: -15
  },
  menuButtonView: {
    flex: 1
  },
  menuButton: {
    flex: 1
  }
})

export default class LaunchScreen extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: ds.cloneWithRows(navigationItems)
    }
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
