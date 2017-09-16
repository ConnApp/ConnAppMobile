import Collection from './Collection.js'
const keys = Object.keys

class Mongoose {
  constructor(collections = ['Default']) {
    // Builds database file for each collection
    this.db = collections
      .map(collectionName => new Collection(collectionName))
      .reduce((finalObj, current) => {
        finalObj[current.name] = current
        return finalObj
      }, {})
  }

  syncAll () {
    return Promise.all(keys(this.db).map(collectionName =>
      new Promise((resolve, reject) => {
        let collection = this.db[collectionName]
        collection.sync({})
        collection.on('sync', data => {
          resolve(collectionName)
        })
      })
    ))
  }

  removeAll () {
    return Promise.all(keys(this.db).map(collectionName => {
      let collection = this.db[collectionName]
      return collection.remove({query: {}})
    }))
  }

  closeAllSockets () {
    keys(this.db).reduce(collectionName => {
      let collection = this.db[collectionName]
      collection.closeSockets()
    })
  }
}

export default Mongoose
