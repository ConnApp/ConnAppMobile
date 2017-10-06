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

import InfoCard from '../Components/InfoCard'
import styles from './Styles/InfoStyles'
import Markdown from 'react-native-easy-markdown'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Info extends Component {
  constructor (props) {
    super()
    this.state = {
      infos: []
    }
  }

  static navigationOptions = ({ navigation  }) => {
    const {state} = navigation
    return {
      title: `Informações`
    }
  }

  setNewState(infos) {
    if (!infos) return false
    if (!Array.isArray(infos)) infos = [infos]
    this.setState({
      ...this.state,
      infos: [
        {
          key: '',
          data: infos
        }
      ]
    })
  }

  addInfo(infos) {
    if (Array.isArray(infos)) infos = infos[0]
    this.setState({
      ...this.state,
      infos: [
        {
          key: '',
          data: [infos, ...this.state.infos[0].data]
        }
      ]
    })
  }

  removeInfo(infos) {
    this.setState({
      ...this.state,
      infos: [
        {
          key: '',
          data: this.state.infos[0].data.filter(oldInfo => {
            return infos._id != oldInfo._id
          })
        }
      ]
    })
  }

  componentWillMount(){
    this.mongo = new Mongoose(['info'])
  }

  componentDidMount() {
    this.mongo.db.info.on('insert', newInfo => {
      this.addInfo(newInfo)
    })

    this.mongo.db.info.find({ sort: { createAt: -1 } })
      .then(dbInfo => {
        this.setNewState(dbInfo)
      })
      .catch(err => {
        console.log(err)
      })
  }

  renderCard (infos) {
    return (
      <InfoCard
        removeItself={this.removeInfo.bind(this)}
        navigation={this.props.navigation}
        info={infos.item}
      />
    )
  }

  renderHeader (pinnedInfo) {
    if (pinnedInfo) return <View></View>
    return (
      <InfoCard
        removeItself={this.removeInfo.bind(this)}
        navigation={this.props.navigation}
        infos={infos.item}
      />
    )
  }

  render () {
    return (
      <SectionList
        keyExtractor={(item, index) => index}
        renderItem={this.renderCard.bind(this)}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={this.renderHeader}
        contentContainerStyle={styles.scrollView}
        sections={this.state.infos}
      >
      </SectionList>
    )
  }
}
