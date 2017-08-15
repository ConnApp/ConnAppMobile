import Datastore from 'react-native-local-mongodb'

class Mongoose {
  constructor(collections = ['Default']) {
    // Builds database file for each collection
    this.db = collections.map.(collection => {
      // Defines filename for the collection
      const filename = `${collection}File`

      // Creates collection Object
      const collectObject = {
        [collection]: new Datastore({ filename})
      }

      // Loads collection object
      collectObject[collection].loadDatabase(function (err) {
        if (err) throw err
        console.log(`${collection} loaded successfully`)
      })

      // Return mapped collection object
      return collectObject
    })

  }

  // find function wrapped in a promise
  find({ collection = 'Default', query = {}, project = {}, skip = undefined, sort = undefined, limit = undefined }) {
    return new Promise((resolve, reject) => {
      // Defines Query object
      let Find = this.db[collection].find(query, project)

      // If sort is defined, use sort
      if (sort) Find = Find.sort(sort)

      // If skip is defined, use skip
      if (skip) Find = Find.skip(skip)

      // If limit is defined, use limit
      if (limit) Find = Find.limit(limit)

      // Executes the query
      return Find.exec((err, result) => err? reject(err) : resolve(result))
    })
  }

  // Insert function wrapped in a promise
  insert({ collection = 'Default', data = undefined }) {
    return new Promise((resolve, reject) => {
      // Validates data argument
      if (!data) {
        // Defines error variable object
        let err = new Error('Insert data not provided')

        // rejects error object
        return reject({err})
      }

      // Insert data into the collection and return promise
      return this.db[collection]
        .insert(data, (err, result) => {
          // if there is error, reject
          if (err) return reject(err)

          // Dispatch WAMP route here to update remote database.
          // Dispatch redux route to updated screen

          return resolve(result)
        })
    })
  }

  // Updated function wrapped in a promise
  update({ collection = 'Default', query = undefined, data = undefined, options = {} }) {
    return new Promise((resolve, reject) => {
      // Defines err variable
      let err = {
        list: []
      }

      // Check if query is defined
      if (!query) err.list.push(new Error('No query provided!'))

      // Check if data is defined
      if (!data) err.list.push(new Error('No data provided!'))

      // If data or query was not defined
      if (err.list.length) return reject(err)


      // Update data in the collection and return promise
      return this.db[collection]
        .update(query, data, options, (err, result) => {
          if (err) return reject(err)
          // Dispatch WAMP route here to update remote database
          // Dispatch redux route to updated screen

          return resolve(result)
        })
    })
  }

  // Count function wrapped in a promise
  count({ collection = 'Default', query }) {
    return new Promise((resolve, reject) => {
      // Count data in the collection and return promise
      return this.db[collection]
        .count(query, (err, result) => err? reject(err) : resolve(result))
    })
  }

  // Remove function wrapped in a promise
  remove({ collection = 'Default', query = undefined, options = {}}) {
    // Remove data from the collection and return promise
    return new Promise((resolve, reject) => {
      // validate query object
      if (!query) {
        let err = new Error('Insert query not provided')
        return reject({err})
      }

      return this.db[collection]
        .remove(query, options, (err, result) => {
          if (err) return reject(err)
          // Dispatch WAMP route here to update remote database
          // Dispatch redux route to updated screen

          return resolve(result)
        })
    })
  }

  // Ensure Indexing function wrapped in a promise
  ensureIndex({ collection = 'Default', options = {} }) {
    return new Promise((resolve, reject) => {
      // Ensure Indexing from the collection and return promise
      return this.db[collection]
        .ensureIndex(options, (err, result) => err? reject(err) : resolve(result))
    })
  }

}

export default Mongoose
