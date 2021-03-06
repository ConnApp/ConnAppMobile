import Collection from './Collection.js'
import LocalStorage from './LocalStorage.js'
const keys = Object.keys

class Mongoose {
  constructor(collections = ['Default']) {
    // Builds database file for each collection
    this.db = collections
      .map(collection => new Collection(collection))
      .reduce((finalObj, current) => {
        finalObj[current.name] = current
        return finalObj
      }, {})
  }

  checkIfAllSync() {
    const isNotSynced = keys(this.db).some(collection => {
      try {
        throw new Error()
      } catch(e) {
        // console.log(e)
      }

      // console.log('check if is sync for each')
      collection = this.db[collection]
      return !collection.isSync
    })
    return !isNotSynced
  }

  initSyncAll () {
    return new Promise((resolve, reject) => {
      Promise.all(
        keys(this.db).map(collection => this.db[collection].sync({fetchAll: true}))
      )
      .then(resolve)
      .catch(reject)
    })
  }

  removeAll () {
    return Promise.all(
      keys(this.db).map(
        collection => this.db[collection].remove({query: {}})
      )
    )
  }

  closeAllSockets () {
    keys(this.db).reduce(collection => this.db[collection].closeSockets())
  }
}

export default Mongoose
