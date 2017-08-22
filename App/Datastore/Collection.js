import Datastore from 'react-native-local-mongodb'
import EventEmitter from 'EventEmitter'
import WAMP from '../WAMP'

export default class Collection {
  constructor (collectionName = 'Default') {
    // Defines filename for the collection
    const filename = `${collectionName}File`

    // Defines event emitter
    this.event = new EventEmitter()

    // Defines object of WAMP connection
    this.sockets = {}

    // Creates collection Object
    this.dataStore = new Datastore({ filename })

    // Collection name
    this.name = collectionName

    // Loads collection object
    this.dataStore.loadDatabase((err) => {
      if (err) throw err

      const subArray = [{
        uri: `connapp.app.${this.name.toLowerCase()}.insert`,
        cb: data => {
          console.log(`connapp.app.${this.name.toLowerCase()}.insert - ${data}`)
          const fromRemote = true
          data = data[0]
          console.log(data + ' to be inserted')
          this.insert({ data, fromRemote })
            .then(res => {
              console.log(res + ' inserted successfully')
            })
            .catch(err => {
              throw err
            })
        }
      }]

      this.sockets['insert'] = [ new WAMP({ subArray }) ]

      console.log(`${collectionName} loaded successfully`)
    })
  }

  sync () {
    this
    .find({})
    .then(news => {
      let ids = news.length? news.map(newDoc => newDoc._id) : []
      console.log(typeof ids, Array.isArray(ids))
      console.log('ids for sync: '+ids)
      console.log(`connapp.server.${this.name.toLowerCase()}.fetch`)
      let pubArray = [
        {
          uri: `connapp.server.${this.name.toLowerCase()}.fetch`,
          data: {argsList: ids}
        }
      ]

      // Dispatch WAMP route here to sync with remote database.
      let ws = new WAMP({ pubArray })

    })
  }

  on (event, cb) {
    console.log(`listenting to ${event}`)
    this.event.addListener(event, cb)
  }

  // find function wrapped in a promise
  find({ query = {}, project = {}, skip = undefined, sort = undefined, limit = undefined }) {
    return new Promise((resolve, reject) => {
      // Defines Query object
      let Find = this.dataStore.find(query, project)

      // If sort is defined, use sort
      if (sort) Find = Find.sort(sort)

      // If skip is defined, use skip
      if (skip) Find = Find.skip(skip)

      // If limit is defined, use limit
      if (limit) Find = Find.limit(limit)

      // Executes the query
      return Find.exec((err, result) => {
        // rejects the error, if any
        if (err) return reject(err)

        // Mounts array for subscribing to fetch routes
        let subArray = result.map(item => ({
          uri: `connapp.app.${this.name.toLowerCase()}.update.${item._id}`,
          cb: data => {
            data = data[0]
            const query = { _id: data._id }
            const fromRemote = true
            this.update({ query, data, fromRemote })
          }
        }))

        // Make sure is array
        if (!Array.isArray(this.sockets['find'])) this.sockets['find'] = []

        // Subscribe to fetch route and update sockets objects
        this.sockets['find'].push( new WAMP({ subArray }) )

        resolve(result)
      })
    })
  }

  // Insert function wrapped in a promise
  insert({ data = undefined, fromRemote = false }) {
    return new Promise((resolve, reject) => {
      // Validates data argument
      if (!data) {
        // Defines error variable object
        let err = new Error('Insert data not provided')

        // rejects error object
        return reject({err})
      }

      // Insert data into the collection and return promise
      return this.dataStore
        .insert(data, (err, result) => {
          // if there is error, reject
          if (err) return reject(err)

          // If update was trigged by remote DB action, no need to notify remote
          // again
          if (!fromRemote) {
            let pubArray = [
              {
                uri: `connapp.server.${this.name.toLowerCase()}.insert`,
                data: result
              }
            ]

            // Dispatch WAMP route here to update remote database.
            let ws = new WAMP({ pubArray })

            // Close connection after dispatch
            ws.close()
          }

          // Mounts array for publishing insert routes

          // Dispatch event to updated screen
          this.event.emit('insert', result)

          // Resolves result
          return resolve(result)
        })
    })
  }

  // Updated function wrapped in a promise
  update({ query = undefined, data = undefined, options = {}, fromRemote = false }) {
    return new Promise((resolve, reject) => {
      // Defines err variable
      let err = {
        list: []
      }
      console.log()

      // Check if query is defined
      if (!query) err.list.push(new Error('No query provided!'))

      // Check if data is defined
      if (!data) err.list.push(new Error('No data provided!'))

      // If data or query was not defined
      if (err.list.length) return reject(err)

      // Update is a set, to update only matched fields
      data = {
        $set: data
      }
      console.log('------- UPDATE ---------')
      console.log(query, data)
      // Update data in the collection and return promise
      return this.dataStore
        .update(query, data, options,  (err, result) => {
          if (err) return reject(err)

          // If the update was triggered by the server or not
          if (!fromRemote) {
            // Dispatch WAMP route here to update remote database
            let pubArray = data.map(item => ({
              uri: `connapp.server.${this.name.toLowerCase()}.update`,
              data: item
            }))

            // Dispatch WAMP route here to update remote database.
            let ws = new WAMP({ pubArray })
          }

          // Dispatch redux route to updated screen
          this.event.emit('update', result)

          return resolve(result)
        })
    })
  }

  // Count function wrapped in a promise
  count({ query }) {
    return new Promise((resolve, reject) => {
      // Count data in the collection and return promise
      return this.dataStore
        .count(query, (err, result) => err? reject(err) : resolve(result))
    })
  }

  // Remove function wrapped in a promise
  remove({ query = undefined, options = {}, fromRemote = false }) {
    // Remove data from the collection and return promise
    return new Promise((resolve, reject) => {
      // validate query object
      if (!query) {
        let err = new Error('Insert query not provided')
        return reject({err})
      }

      return this.dataStore
        .remove(query, options, (err, result) => {
          if (err) return reject(err)
          // Dispatch WAMP route here to update remote database
          // Dispatch redux route to updated screen
          this.event.emit('remove', result)

          return resolve(result)
        })
    })
  }

  // Ensure Indexing function wrapped in a promise
  ensureIndex({ collection = 'Default', options = {} }) {
    return new Promise((resolve, reject) => {
      // Ensure Indexing from the collection and return promise
      return this.dataStore
        .ensureIndex(options, (err, result) => err? reject(err) : resolve(result))
    })
  }
}
