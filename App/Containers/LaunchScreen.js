import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView } from 'react-native'

import { Images } from '../Themes'
import { Button } from 'react-native-elements'

const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})

const navigationItems = [
  { title: 'Programação', bg: '#65BAF7' },
  { title: 'Agenda',      bg: '#8AB2C0' },
  { title: 'Informações', bg: '#AFAB89' },
  { title: 'Notícias',    bg: '#D4A352' },
  { title: 'Notas',       bg: '#F99C1B' }
]

const buttonStyle = {
  padding: 1,
  margin: 0,
  flex: 1
}
// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor() {
    super()
    this.state = {
      dataSource: ds.cloneWithRows(navigationItems)
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => (
              <View style={buttonStyle} >
              <Button
                large
                backgroundColor={rowData.bg}
                title={rowData.title} />
              </View>
            )}
          />
      </View>
    )
  }
}
