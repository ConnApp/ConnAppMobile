import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images } from '../Themes'
import { Button } from 'react-native-elements'
import Gradient from '../Gradient'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

const colors = {
  initialColor: '054D73',
  finalColor: '5FA7CD',
  steps: 6
}

const colorGradient = new Gradient(colors)

console.log(colorGradient)

const navigationItems = [
  { title: 'Programação', bg: colorGradient[1] },
  { title: 'Agenda',      bg: colorGradient[2]  },
  { title: 'Informações', bg: colorGradient[3]  },
  { title: 'Notícias',    bg: colorGradient[4]  },
  { title: 'Notas',       bg: colorGradient[5]  }
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colorGradient[0]
  },
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerImage: {
    flex: 1,
    marginTop: 15,
    width: 300,
    resizeMode: 'contain'
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
