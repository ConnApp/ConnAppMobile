import wampConfig from './config.js'
import wamp from 'wamp.js2'

class WAMP {
  constructor({subArray = [], pubArray = []}) {
    // Builds conenction object
    this.Connection = new wamp.Connection(wampConfig)

    //Listens for status change to updat the class variables
    this.Connection.onstatuschange(this.onstatuschange)

    // Open connection handler
    this.Connection.onopen = (session) => {
      // If array subs exists, subscribe to each
      if (subArray.length) {
        subArray.forEach(sub => {
          session.subscribe(sub.uri, sub.cb)
        })
      }

      // If array subs exists, subscribe to each
      if (pubArray.length) {
        pubArray.forEach(pub => {
          session.publish(sub.uri, sub.data)
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

}

export default WAMP
