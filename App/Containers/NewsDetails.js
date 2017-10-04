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

import {
  flatten,
  getCompleteDate,
  capitalize,
  getDurationFromEvent,
  reduceToMarkdownList,
} from '../Helpers'
import TextCard from '../Components/TextCard'
import ImageCover from '../Components/ImageCover'
import styles from './Styles/NewsDetailsStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class NewsDetails extends Component {
  constructor (props) {
    super()
    this.dataOrder = [
      'cover',
      'title',
      'message',
    ]

    const { news } = props.navigation.state.params
    const newsData = this.getNewsDataSet(news, this.dataOrder)
    // console.log(event)
    this.state = {
      news,
      dataOrder: this.dataOrder,
      newsData: ds.cloneWithRows(newsData)
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    // console.log(state)
    if(state.params != undefined){
      return {
        title: getCompleteDate(state.params.news.createAt)
      }
    }
  }

  updateNews(news) {
    const newsData = this.getNewsDataSet(news, this.dataOrder)
    this.setState({
      ...this.state,
      news,
      newsData: ds.cloneWithRows(newsData)
    })
  }

  getNewsDataSet(news, dataOrder) {
    const array = dataOrder.map(newsName => {
      let data = news[newsName] || newsName
      let isArray = Array.isArray(data)
      let isName = newsName == 'title'

      if (isName) {
        newsName = data
        data = 'nill'
      } else {
        newsName = capitalize(newsName)
      }


      return !isArray? {newsName, data} : {newsName, data: reduceToMarkdownList(data)}
    }).filter(info => info.data)

    return flatten(array)
  }

  componentWillMount(){
    this.mongo = new Mongoose(['news'])
  }

  componentDidMount() {
    this.mongo.db.news.on('update', newNews => {
      this.updateNews(newNews)
    })

    const query = { _id: this.state.news._id }

    this.mongo.db.news.find({ query })
      .then(res => {
        this.updateNews(res[0])
      })
      .catch(err => {
        console.log(err)
      })
  }

  translateRowName (rowName) {
    // console.log(rowName)
    let name
    switch (rowName) {
      case 'Title':
        name =  'Título'
        break;
      case 'Message':
        name =  'Descrição'
        break;
      default:
        name = rowName
    }

    return name
  }

  renderRow(rowData) {
    if(rowData.newsName != 'Cover') {
      const newsName = this.translateRowName(rowData.newsName)
      return <TextCard title={`##**${newsName}**`} text={`${rowData.data}`}/>
    }
    return (
      <View style={styles.contentContainer}>
        <ImageCover containerStyle={styles.imageContainerStyle} imageStyle={styles.coverStyles} image={rowData.data}/>
      </View>
    )
  }

  render () {
    const { news, newsData } = this.state
    return (
      <ScrollView>
        <ListView
          dataSource={newsData}
          renderRow={(rowData) => this.renderRow(rowData)}
          contentContainerStyle={styles.contentContainer}
        />
      </ScrollView>
    )
  }
}
