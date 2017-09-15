

export function groupBy (dataSet, field) {
  const collectionObject = dataSet.reduce((finalGroup, data) => {
    (finalGroup[data[field]] = finalGroup[data[field]] || []).push(data);
    return finalGroup
  }, {})

  return Object.keys(collectionObject).map(key => ({
    key, data: collectionObject[key]
  }))
}
