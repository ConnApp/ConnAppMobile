 import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

import { Images } from '../Themes'
import Mongoose  from '../Datastore'
import WAMP  from '../WAMP'
const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})
let mongo = new Mongoose(['fakenews', 'test'])
let ws

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor() {
    super()
    this.state = {
      news: [],
      dataSource: ds.cloneWithRows([])
    }
  }
  componentWillMount () {
    this.setState({
      ...this.state,
      dataSource: ds.cloneWithRows(this.state.news)
    })

    mongo.db.fakenews.on('insert', (data) => {
      this.insertNews(data)
    })

    mongo.db.fakenews.sync()
  }
  insertNews (newFakewnews) {
    const news = {
      news: [newFakewnews, ...this.state.news]
    }
    this.setState({
      ...this.state.news,
      news,
      dataSource: ds.cloneWithRows(news)
    })
  }
  setNews (news) {
    this.setState({
      ...this.state.news,
      news,
      dataSource: ds.cloneWithRows(news)
    })
  }
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>

          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => (
              <View style={styles.section} >
                <Text style={styles.titleText}>
                  {rowData.title}
                </Text>
                <Text style={styles.sectionText}>
                  {rowData.body}
                </Text>
              </View>
            )}
          />


        </ScrollView>
      </View>
    )
  }
}
