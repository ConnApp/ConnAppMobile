import React, { Component } from 'react'
import { View } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { NavigationActions } from 'react-navigation';
import WAMP from '../WAMP'
import Datastore from '../Datastore'
const collectionsArray = ['places', 'eventtypes', 'speakers', 'events', 'news', 'info']
export default class ServicesController extends Component {
  constructor(props) {
    super()
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },
    })
    if (!this.isBuilt) this.setUpListener()
  }

  setUpListener() {
    this.isBuilt = true
    const subArray = [
      {
        uri: `connapp.app.news.insert`,
        cb: (newNews) => {
          const { title, message } = newNews[0]
          PushNotification.localNotification(
            {
              title,
              message,
            }
          )
        }
      },
    ]

    // // console.log(subArray)
    this.sockets = new WAMP({ subArray })
    this.mongo = new Datastore(collectionsArray)
  }

  render() {
    return null
  }
}
