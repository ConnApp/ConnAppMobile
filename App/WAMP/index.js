import wampConfig from './config.js'
import { NetInfo } from 'react-native'
import wamp from 'wamp.js2'

class WAMP {
  constructor({subArray = [], pubArray = [], throttle = 1000}) {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(`Internet is ${isConnected? 'Connected' : 'Disconnected'}`)
      if (isConnected) {
        // Builds conenction object
        this.Connection = new wamp.Connection(wampConfig)

        //Listens for status change to updat the class variables
        this.Connection.onstatuschange(this.onstatuschange)

        // Open connection handler
        this.Connection.onopen = (session) => {
          // If array subs exists, subscribe to each
          // console.log('connection open')
          if (subArray.length) {
            this.subStats = subArray.map(sub => {
              let status = true
              try {
                session.subscribe(sub.uri, sub.cb)
              } catch(e) {
                status = e
              }
              // console.log(`Subscribed to ${sub.uri}`)
              return {
                sub: sub,
                status: status
              }
            })
          }

          // If array subs exists, subscribe to each
          // console.log(pubArray.length)
          if (pubArray.length) {
            this.pubStats = pubArray.map(pub => {
              let status = true

              if (!Array.isArray(pub.data)) {
                pub.data = [pub.data]
              }

              try {
                setTimeout(() => {
                  session.publish(pub.uri, [pub.data], {data: pub.data})
                }, throttle)
              } catch(e) {
                status = e
              }

              // console.log(`Published ${pub.data} to ${pub.uri}`)

              return {
                pub: pub,
                status: status
              }
            })
          }
        }

        this.Connection.open()
      }
    })
  }

  // Close connection
  close() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) this.Connection.close()
    })
  }

  // Listens for connection close
  onclose() {
    // console.log('WAMP connection closed')
  }

  // Listens for status change method
  onstatuschange(status, details) {
    this.status, this.details = status, details
  }

}

export default WAMP
