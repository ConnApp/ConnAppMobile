import Collection from './Collection.js'

class Mongoose {
  constructor(collections = ['Default']) {
    // Builds database file for each collection
    this.db = collections
      .map(collectionName => new Collection(collectionName))
      .reduce((finalObj, current) => {
        finalObj[current.name] = current
        return finalObj
      }, {})
    console.log(this.db)
  }

  closeAllSockets () {
    Object.keys(this.db).forEach(collectionName => {
      let collection = this.db[collectionName];
      Object.keys(collection.sockets).forEach(socketName => {
        let sockets = collection.sockets[socketName];
        sockets.forEach(socket => socket.close())
      })
    })
  }

}

export default Mongoose
