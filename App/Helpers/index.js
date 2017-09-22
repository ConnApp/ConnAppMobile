

export function groupBy (dataSet, field) {
  const collectionObject = dataSet.reduce((finalGroup, data) => {
    (finalGroup[data[field]] = finalGroup[data[field]] || []).push(data);
    return finalGroup
  }, {})

  return Object.keys(collectionObject).map(key => ({
    key, data: collectionObject[key]
  }))
}

export function flatten(array) {
    return Array.prototype.concat(...array)
}

export function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1)
}
