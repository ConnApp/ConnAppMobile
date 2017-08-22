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

  populateNews () {
    return mongo.db.fakenews.find({})
  }

  componentWillMount () {
    this.populateNews()
      .then(news => {
        console.log(news)
        this.setNews(news)
        mongo.db.fakenews.sync()
      })
      .catch(err => {
        throw err
      })

    mongo.db.fakenews.on('insert', (data) => {
      this.insertNews(data)
    })

    mongo.db.fakenews.on('update', (data) => {
      this.updateNew(data)
    })

    mongo.db.fakenews.on('update', (data) => {
      console.log('data for update ---------------')
      console.log(data)
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

    const news = this.state.news.map(newDoc => {

      const isMatch = newDoc._id == newNews._id
      console.log(isMatch)
      return isMatch? newNews : newDoc
    })

    this.setNews (news)

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
