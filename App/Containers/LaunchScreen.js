import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView, StyleSheet } from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'
import Gradient from '../Gradient'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

const colors = {
  initialColor: Colors.primary,
  finalColor: Colors.primaryLight,
  steps: 6
}

const colorGradient = new Gradient(colors)


const navigationItems = [
  { title: 'Programação', navKey: 'Events', bg: colorGradient[1]  },
  { title: 'Agenda',      navKey: 'Events', bg: colorGradient[2]  },
  { title: 'Informações', navKey: 'Events', bg: colorGradient[3]  },
  { title: 'Notícias',    navKey: 'Events', bg: colorGradient[4]  },
  { title: 'Notas',       navKey: 'Events', bg: colorGradient[5]  }
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
    marginTop: 0,
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

// Hack to hide navigation bar
const style = StyleSheet.create({ hideText:{ display:"none" } })

export default class LaunchScreen extends Component {

  static navigationOptions = {
    header: <Text style={style.hideText} ></Text>
  }

  constructor () {
    super()
    this.state = {
      dataSource: ds.cloneWithRows(navigationItems)
    }
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
