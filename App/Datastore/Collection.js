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
    this.sockets = []

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
          // console.log(`connapp.app.${this.name.toLowerCase()}.insert - ${data}`)
          const fromRemote = true
          data = data[0]
          // console.log(`${data}  to be inserted`)
          this.insert({ data, fromRemote })
            .then(res => {
              // console.log(`${res._id} inserted successfully`)
            })
            .catch(err => {
              throw err
            })
        }
      }]

      // console.log(subArray)
      this.sockets.push( new WAMP({ subArray }) )

      // console.log(`${collectionName} loaded successfully`)
    })
  }

  closeSockets () {
    this.sockets.forEach(socket => socket.close())
  }

  sync ({query = {}, getAll = true, dateQuery = null}) {
    return new Promise((resolve, reject) => {
      this
      .find({ query, getAll })
      .then(results => {
        // console.log(results.length)

        if (dateQuery) {
          results = results.filter(res => {
            let startDate = new Date(res.start).getTime()
            let endDate = new Date(res.end).getTime()

            return dateQuery.start.$gt.getTime() < startDate && dateQuery.end.$lt.getTime() > endDate
          })
        }

        // console.log(results.length)

        let ids = results.length? results.map(res => res._id) : []

        let pubArray = [
          {
            uri: `connapp.server.${this.name.toLowerCase()}.fetch`,
            data: {argsList: ids, argsDict: Object.assign(query, dateQuery)}
          }
        ]

        // Dispatch WAMP route here to sync with remote database.
        this.sockets.push( new WAMP({ pubArray }) )

        resolve(results.filter(res => res.active))
      })
      .catch(reject)
    })
  }

  on (action, callback) {
    // console.log(`listenting to ${action}`)
    this.event.addListener(action, callback)
  }

  // find function wrapped in a promise
  find({ query = {}, project = {}, skip = undefined, sort = { createdAt: -1 }, limit = undefined , getAll = false}) {
    return new Promise((resolve, reject) => {
      // Defines Query object
      let Find = this.dataStore.find(query, project)

      // If sort is defined, use sort
      if (sort) Find = Find.sort(sort)

      // If skip is defined, use skip
      if (skip) Find = Find.skip(skip)

      // If limit is defined, use limit
      if (limit) Find = Find.limit(limit)

      if (!getAll) {
        query.active = true
      }

      // Executes the query
      return Find.exec((err, result) => {
        // rejects the error, if any
        if (err) return reject(err)

        // Mounts array for subscribing to fetch routes
        let subArray = result.map(item => ({
          uri: `connapp.app.${this.name.toLowerCase()}.update.${item._id}`,
          cb: data => {
            // console.log(`connapp.app.${this.name.toLowerCase()}.update.${item._id} was called`)
            data = data[0]
            // console.log(data)
            const query = { _id: data._id }
            const fromRemote = true
            if (data.active) {
              // console.log(`Performing regular update remove on ${query._id}`)
              this.update({ query, data, fromRemote })
                .then(res => {
                  // console.log(`${query._id} updated with success`)
                })
                .catch(err => {
                  // console.log(err)
                })
            } else {
              // console.log(`Performing logical remove on ${query._id}`)
              // console.log(query)
              this.logicalRemove({ query, fromRemote })
                .then(res => {
                  // console.log(`${query._id} removed with success`)
                })
                .catch(err => {
                  // console.log(err)
                })
            }
          }
        }))

        // Make sure is array
        if (!Array.isArray(this.sockets['find'])) this.sockets['find'] = []

        // Subscribe to fetch route and update sockets objects
        this.sockets.push( new WAMP({ subArray }) )

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
        let err = new Error(`Insert data not provided`)

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
            this.sockets.push( new WAMP({ pubArray }) )
          }

          // Mounts array for publishing insert routes
          // console.log(result)
          // Dispatch event to updated screen
          this.event.emit('insert', result)

          // Resolves result
          return resolve(result)
        })
    })
  }

  // Remove function wrapped in a promise
  logicalRemove({ query = undefined, fromRemote = false }) {
    // console.log(`Logical remove initated`)
    return new Promise((resolve, reject) => {
      if (!query) {
        // Defines error variable object
        let err = new Error(`No query provided for logicalRemove`)

        // rejects error object
        return reject({err})
      }

      const data = {
        active:false
      }

      this
        .update({query, data, fromRemote})
        .then(resolve)
        .catch(reject)
    })
  }

  // Updated function wrapped in a promise
  update({ query = undefined, data = undefined, options = {}, fromRemote = false }) {
    return new Promise((resolve, reject) => {
      // Defines err variable
      let err = {
        list: []
      }
      // console.log(!query)
      // Check if query is defined
      if (!query) err.list.push(new Error(`No query provided!`))

      // Check if data is defined
      if (!data) err.list.push(new Error(`No data provided!`))

      // If data or query was not defined
      if (err.list.length) return reject(err)

      options.returnUpdatedDocs = true

      // Update is a set, to update only matched fields
      const setData = {
        $set: data
      }
      // console.log(`------- UPDATE ---------`)
      // console.log(query, data)
      // Update data in the collection and return promise
      return this.dataStore
        .update(query, setData, options, (err, result, newDocs) => {
          if (err) return reject(err)

          if (!Array.isArray(newDocs)) newDocs = [newDocs]

          // If the update was triggered by the server or not
          if (!fromRemote) {
            // Dispatch WAMP route here to update remote database
            let pubArray = newDocs.map(item => ({
              uri: `connapp.server.${this.name.toLowerCase()}.update`,
              data: item
            }))

            // Dispatch WAMP route here to update remote database.
            this.sockets.push( new WAMP({ pubArray }) )
          }

          // Dispatch redux route to updated screen
          this.event.emit('update', newDocs)

          return resolve({newDocs, result})
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
        let err = new Error(`Insert query not provided`)
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
