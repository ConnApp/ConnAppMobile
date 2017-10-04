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
    this.state = {
      news: []
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    return {
      title: `Notícias`
    }
  }

  setNewState(news) {
    if (!news) return false
    if (!Array.isArray(news)) news = [news]
    this.setState({
      ...this.state,
      news: [
        {
          key: '',
          data: news
        }
      ]
    })
  }

  addNews(news) {
    this.setState({
      ...this.state,
      news: [
        {
          key: '',
          data: [news, ...this.state.news[0].data]
        }
      ]
    })
  }

  removeNews(news) {
    this.setState({
      ...this.state,
      news: [
        {
          key: '',
          data: this.state.news[0].data.filter(oldNews => {
            return news._id != oldNews._id
          })
        }
      ]
    })
  }

  componentWillMount(){
    this.mongo = new Mongoose(['news'])
  }

  componentDidMount() {
    this.mongo.db.news.on('insert', newNews => {
      this.addNews(newNews)
    })

    this.mongo.db.news.on('logicalRemove', newNews => {
      this.removeNews(newNews)
    })

    this.mongo.db.news.find({ sort:{createAt: -1} })
      .then(dbNews => {
        this.setNewState(dbNews)
      })
      .catch(err => {
        console.log(err)
      })
  }

  renderCard (news) {
    return <NewsCard navigation={this.props.navigation} news={news.item}/>
  }

  renderHeader (pinnedNews) {
    if (pinnedNews) return <View></View>
    return <NewsCard navigation={this.props.navigation} news={news.item}/>
  }

  render () {
    return (
      <SectionList
        keyExtractor={(item, index) => index}
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
