import wampConfig from './config.js'
import wamp from 'wamp.js2'

class WAMP {
  constructor(subArray = []) {
    // Builds conenction object
    this.Connection = new wamp.Connection(wampConfig)

    //Listens for status change to updat the class variables
    this.Connection.onstatuschange(this.onstatuschange)
    // Open connection handler
    this.Connection.onopen = (session) => {
      if (subArray.length) {
        subArray.forEach(sub => subscribe(session, sub, sub))
      }
    }

    // Open Connection
    this.Connection.open()
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
  publish(session, sub) {
    session.publish(sub.uri, sub.cb)
  }
}

export default WAMP
