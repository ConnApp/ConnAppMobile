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
import styles from './Styles/InfoDetailsStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class InfoDetails extends Component {
  constructor (props) {
    super()
    this.dataOrder = [
      'title',
      'message',
    ]

    const { info } = props.navigation.state.params
    const infoData = this.getInfoDataSet(info, this.dataOrder)
    // console.log(event)
    this.state = {
      info,
      dataOrder: this.dataOrder,
      infoData: ds.cloneWithRows(infoData)
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    // console.log(state)
    if(state.params != undefined){
      return {
        title: 'Informações'
      }
    }
  }

  updateInfo(info) {
    const infoData = this.getInfoDataSet(info, this.dataOrder)
    this.setState({
      ...this.state,
      info,
      infoData: ds.cloneWithRows(infoData)
    })
  }

  getInfoDataSet(info, dataOrder) {
    const array = dataOrder.map(infoName => {
      let data = info[infoName] || infoName
      let isArray = Array.isArray(data)
      let isName = infoName == 'title'

      if (isName) {
        infoName = data
        data = 'nill'
      } else {
        infoName = capitalize(infoName)
      }

      if (data == 'cover') {
        data = null
      }
      return !isArray? {infoName, data} : {infoName, data: reduceToMarkdownList(data)}
    }).filter(info => info.data)

    return flatten(array)
  }

  componentWillMount(){
    this.mongo = new Mongoose(['info'])
  }

  componentDidMount() {
    this.mongo.db.info.on('update', newInfo => {
      this.updateInfo(newInfo)
    })

    const query = { _id: this.state.info._id }

    this.mongo.db.info.find({ query })
      .then(res => {
        this.updateInfo(res[0])
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
    if(rowData.infoName != 'Cover') {
      const infoName = this.translateRowName(rowData.infoName)
      return <TextCard title={`##**${infoName}**`} text={`${rowData.data}`}/>
    }
    return (
      <View style={styles.contentContainer}>
        <ImageCover containerStyle={styles.imageContainerStyle} imageStyle={styles.coverStyles} image={rowData.data}/>
      </View>
    )
  }

  render () {
    const { infoData } = this.state
    return (
      <ScrollView>
        <ListView
          dataSource={infoData}
          renderRow={(rowData) => this.renderRow(rowData)}
          contentContainerStyle={styles.contentContainer}
        />
      </ScrollView>
    )
  }
}
