import wampConfig from './config.js'
import wamp from 'wamp.js2'

class WAMP {
  constructor({subArray = [], pubArray = []}) {
    // Builds conenction object
    this.Connection = new wamp.Connection(wampConfig)
    this.subArray = subArray
    this.pubArray = pubArray

    //Listens for status change to updat the class variables
    this.Connection.onstatuschange(this.onstatuschange)

    // Open connection handler
    this.Connection.onopen = (session) => {
      // If array subs exists, subscribe to each
      if (subArray.length) {
        subArray.forEach(sub => {
          this.subscribe(session, sub)
        })
      }

      // If array subs exists, subscribe to each
      if (pubArray.length) {
        pubArray.forEach(pub => {
          this.publish(session, pub)
          .then(function(test) {
            console.log(test, 'test')
          })
        })
      }
    }

    // Open Connection
    this.Connection.open()
  }

  // Close connection
  close() {
    this.Connection.close()
  }

  // Listens for connection close
  onclose() {
    console.log('WAMP connection closed')
  }

  // Listens for status change method
  onstatuschange(status, details) {
    this.status, this.details = status, details
  }

  // subscribes to a URI with a callback
  subscribe(session, sub) {
    console.log(sub)
    session.subscribe(sub.uri, sub.cb)
  }

  // publish data to an URI
  publish(session, pub) {
    session.publish(pub.uri, pub.data)
  }
}

export default WAMP
