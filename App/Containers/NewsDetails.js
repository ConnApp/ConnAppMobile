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
import styles from './Styles/NewsDetailsStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class NewsDetails extends Component {
  constructor (props) {
    super()
    this.dataOrder = [
      'title',
      'message'
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

  updateNews() {
    this.setState({
      ...this.state
    })
  }

  getNewsDataSet(news, dataOrder) {
    const array = dataOrder.map(newsName => {
      let data = news[newsName] || newsName
      let isArray = Array.isArray(data)
      let isName = newsName == 'name'

      if (isName) {
        newsName = data
        data = 'nill'
      } else {
        newsName = capitalize(newsName)
      }


      return !isArray? {newsName, data} : {newsName, data: this.reduceToMarkdownList(data)}
    }).filter(info => info.data)

    return flatten(array)
  }

  componentWillMount(){
    this.mongo = new Mongoose(['news'])
  }

  componentDidMount() {
    this.mongo.db.news.on('update', newLocal => {

    })

    const query = { _id: this.state.news._id }

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
      case 'Media':
        name =  'Horário'
        break;
      default:
        name = rowName
    }

    return name
  }

  renderRow(rowData) {
    const newsName = this.translateRowName(rowData.newsName)
    return <TextCard title={`##**${newsName}**`} text={`${rowData.data}`}/>
  }

  render () {
    return (
      <ScrollView>
        <ListView
          dataSource={this.state.newsData}
          renderRow={(rowData) => this.renderRow(rowData)}
          contentContainerStyle={styles.contentContainer}
        />
      </ScrollView>
    )
  }
}
