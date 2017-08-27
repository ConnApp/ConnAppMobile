 import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ListView } from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

import { Images } from '../Themes'
import Mongoose  from '../Datastore'
import WAMP  from '../WAMP'
const ds = new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow != newRow})
let mongo = new Mongoose(['fakenews'])
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
    mongo.db.fakenews.on('insert', (data) => {
      this.insertNews(data)
    })

    mongo.db.fakenews.on('update', (data) => {
      this.updateNew(data)
    })

    // Sync has to come last because the event listeners have to be set
    // beforehand to update the screen correctly
    mongo.db.fakenews.sync()
      .then(news => {
        console.log('-----News synced')
        console.log(news)
        this.setNews(news)
      })
      .catch(err => {
        throw err
      })
  }
  insertNews (newFakewnews) {
    console.log('Insert insert stuff')

    const news = [newFakewnews, ...this.state.news]

    this.setState({
      ...this.state.news,
      news,
      dataSource: ds.cloneWithRows(news)
    })

  }

  updateNew (newNews) {
    console.log('Update Stuff')
    console.log(newNews)
    console.log('Update Stuff')

    if (newNews[0]) newNews = newNews[0]

    const news = this.state.news.map(newDoc =>
      newDoc._id == newNews._id? newNews : newDoc
    ).filter(newDoc => newDoc.active)

    this.setNews(news)
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
