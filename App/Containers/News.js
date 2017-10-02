import React, { Component } from 'react'
import {
  SectionList,
  Text,
  Image,
  View,
  ScrollView,
  ListView,
  StyleSheet,
  TextInput
} from 'react-native'

import { Images, Colors } from '../Themes'
import { Button } from 'react-native-elements'

import Mongoose from '../Datastore'

import { flatten, capitalize, getDurationFromEvent } from '../Helpers'

import NewsCard from '../Components/NewsCard'
import styles from './Styles/NewsStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class News extends Component {
  constructor (props) {
    super()
    // console.log(event)
    this.state = {
      news: [{
        key: '',
        data: [
          {
            title: 'Lorem Ipsum',
            time: new Date().getTime(),
            text: 'dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          }
        ]
      }]
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    // console.log(state)
    return {
      title: `Notícias`
    }
  }

  componentWillMount(){
    this.mongo = new Mongoose(['news'])
  }

  componentDidMount() {

  }

  renderCard (news) {
    return <NewsCard news={news.item}/>
  }

  renderHeader (pinnedNews) {
    return <View></View>
    // return <TextCard title={`##**${eventName}**`} text={`${rowData.data}`}/>
  }

  render () {
    return (
      <SectionList
        keyExtractor={(item, index) => item._id}
        renderItem={this.renderCard.bind(this)}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={this.renderHeader}
        contentContainerStyle={styles.scrollView}
        sections={this.state.news}
      >
      </SectionList>
    )
  }
}
