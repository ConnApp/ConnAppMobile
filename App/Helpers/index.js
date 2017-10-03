import { Platform, NetInfo } from 'react-native'

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

export function getHourFromTimeStamp (timeStamp) {
  const time = new Date(timeStamp)
  let hours = time.getHours() + 3 // Timezone offset. Brazil is GMT+3, hence 3
  let minutes = time.getMinutes()
  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`

  return `${hours.toString()}:${minutes.toString()}h`
}

export function getDate(timeStamp) {
  const time = new Date(timeStamp)
  let day = time.getDate()
  let month = time.getMonth() + 1
  if (day < 10) day = `0${day}`
  if (month < 10) month = `0${month}`

  return `${day.toString()}/${month.toString()}`
}

export function getCompleteDate(timeStamp) {
  return getDate(timeStamp) + ' - ' + getHourFromTimeStamp(timeStamp)
}

export function getDurationFromEvent(event) {
  if (!event.start || !event.end) return ''

  const start = getHourFromTimeStamp(event.start)
  const end = getHourFromTimeStamp(event.end)

  return `${start} - ${end}`
}

export function toMongoIdObject(item) {
  return { _id: item._id }
}

export function isNetworkConnected() {
  if (Platform.OS === 'ios') {
    return new Promise(resolve => {
      const handleFirstConnectivityChangeIOS = isConnected => {
        NetInfo.isConnected.removeEventListener('change', handleFirstConnectivityChangeIOS);
        console.log(isConnected)
        resolve(isConnected);
      };
      NetInfo.isConnected.addEventListener('change', handleFirstConnectivityChangeIOS);
    });
  }

  return NetInfo.isConnected.fetch();
}

export function reduceToMarkdownList(data) {
  return data.reduce((finalArray, item) => {
    finalArray.push(`* ${item}`)
    return finalArray
  }, []).join('\n')
}
