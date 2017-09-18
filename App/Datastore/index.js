import Collection from './Collection.js'
import LocalStorage from './LocalStorage.js'
const keys = Object.keys

class Mongoose {
  constructor(collections = ['Default'], isLocal = false) {
    // Builds database file for each collection
    this.isLocal = isLocal
    this.db = collections
      .map(collection => isLocal? new Collection(collection) : new LocalStorage(collection))
      .reduce((finalObj, current) => {
        finalObj[current.name] = current
        return finalObj
      }, {})
  }
  
  checkIfAllSync() {
    if (this.isLocal) return false
    const isNotSynced = keys(this.db).some(collection => {
      try {
        throw new Error()
      } catch(e) {
        console.log(e)
      }

      console.log('chekc if is sync for each')
      collection = this.db[collection]
      return !collection.isSync
    })
    return !isNotSynced
  }

  initSyncAll () {
    if (this.isLocal) return false
    return new Promise((resolve, reject) => {
      this.removeAll()
      .then(res =>
        Promise.all(
          keys(this.db).map(collection => this.db[collection].sync({}))
        )
        .then(resolve)
        .catch(reject)
      )
    })
  }

  removeAll () {
    if (this.isLocal) return false
    return Promise.all(
      keys(this.db).map(
        collection => this.db[collection].remove({query: {}})
      )
    )
  }

  closeAllSockets () {
    if (this.isLocal) return false
    keys(this.db).reduce(collection => this.db[collection].closeSockets())
  }
}

export default Mongoose
