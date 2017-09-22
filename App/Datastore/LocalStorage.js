import Datastore from 'react-native-local-mongodb'
import EventEmitter from 'EventEmitter'

export default class LocalStorage {
  constructor (collectionName = 'Default') {
    // Defines filename for the collection
    const filename = `${collectionName}LocalFile`

    // Defines event emitter
    this.event = new EventEmitter()

    // Defines object of WAMP connection
    this.sockets = []

    // Creates collection Object
    this.dataStore = new Datastore({ filename, autoload: true})

    // Collection name
    this.name = collectionName
  }

  on (action, callback) {
    // // console.log(`listenting to ${action}`)
    this.event.addListener(action, callback)
  }

  // find function wrapped in a promise
  find({ dateQuery = null, query = {}, project = {}, skip = undefined, sort = undefined, limit = undefined , getAll = false, isSync = false}) {
    // console.log(`Initiating Find for ${this.name}`)
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
        // console.log(`Found ${result.length} items on ${this.name}`)
        if (dateQuery) {
          // console.log(`Has dateQuery, preparing to filter`)
          result = result.filter(res => {
            let startDate = new Date(res.start).getTime()
            let endDate = new Date(res.end).getTime()

            return dateQuery.start.$gt.getTime() < startDate && dateQuery.end.$lt.getTime() > endDate
          })
        }

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

      // Make sure data is array
      if (!Array.isArray(data)) data = [data]

      const query = {
        $or: data.map(res => ({_id: res._id})).filter(res => res._id)
      }
      // console.log(query)
      // Insert data into the collection and return promise
      this.dataStore.find(query, (err, foundData) => {
        // Map found array to id. To compare data sets easily
        const idArray = foundData.map(res => res._id)
        // console.log('Found: ' + foundData.length + ' items')
        // Filter data to insert
        const dataToInsert = data.filter(res => {
          // Check if data fromm server is also on local db. Will update, not insert
          const index = idArray.indexOf(res._id)
          if (index == -1) {
            return true
          } else {
            // Update existing data
            this.update({ query: {_id: res._id}, data: res, fromRemote })
            return false
          }
        })

        // console.log(dataToInsert.length + ' items are being inserted to ' + this.name)
        // Insert new data
        this.dataStore.insert(dataToInsert, (err, result) => {
          // if there is error, reject
          if (err) return reject(err)

          this.event.emit('insert', result)

          // Resolves result
          return resolve(result)
        })
      })
    })
  }

  // Remove function wrapped in a promise
  logicalRemove({ query = undefined, fromRemote = false }) {
    // // console.log(`Logical remove initated`)
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
      // // console.log(!query)
      // Check if query is defined
      if (!query) err.list.push(new Error(`No query provided!`))

      // Check if data is defined
      if (!data) err.list.push(new Error(`No data provided!`))

      // If data or query was not defined
      if (err.list.length) return reject(err)

      options.returnUpdatedDocs = true
      options.upsert = true

      // Update is a set, to update only matched fields
      const setData = {
        $set: data
      }
      // // console.log(`------- UPDATE ---------`)
      // // console.log(query, data)
      // Update data in the collection and return promise
      return this.dataStore
        .update(query, setData, options, (err, result, newDocs) => {
          if (err) return reject(err)

          if (!Array.isArray(newDocs)) newDocs = [newDocs]

          // Dispatch redux route to updated screen
          this.event.emit('update', newDocs)

          return resolve({newDocs, result})
        })
    })
  }

  // Count function wrapped in a promise
  count({ query = {} }) {
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
      if (typeof query == 'undefined') {
        let err = new Error(`Insert query not provided`)
        return reject({err})
      }

      options.multi = true

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
