import ReactPlayer from 'react-player'
import { fillTitle } from './core'

const sortKeys = {
  title: 'title',
  updated_at: 'updated_at',
  created_at: 'created_at',
  connected_at: 'connected_at',
  position: 'position'
}

function stringComparator(a, b) {
  // since contents aren't guaranteed to have names, check for nulls
  const nameA = fillTitle(a).toLowerCase()
  const nameB = fillTitle(b).toLowerCase()
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  return 0
}

function numComparator(a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function timeComparator(a, b) {
  const dateA = new Date(a)
  const dateB = new Date(b)
  if (dateA < dateB) {
    return -1
  }
  if (dateA > dateB) {
    return 1
  }
  return 0
}

// chooses a comparator to use based on input type
function comparator(a, b, param) {
  switch (param) {
    case sortKeys.title:
      return stringComparator(a, b)
    case sortKeys.created_at:
      return timeComparator(a, b)
    case sortKeys.updated_at:
      return timeComparator(a, b)
    case sortKeys.connected_at:
      return timeComparator(a, b)
    case sortKeys.position:
      return numComparator(a, b)
    default:
      return 0
  }
}

// executes array.sort with comparator and handles order inversion
function sortChannelContents(channelContents, sortObj) {
  const { orderKey, paramKey } = sortObj
  const sortedArr = channelContents.sort((a, b) =>
    comparator(a[paramKey], b[paramKey], paramKey)
  )
  if (orderKey) {
    return sortedArr
  } else {
    return sortedArr.reverse()
  }
}


export {
  sortKeys,
  sortChannelContents,
}
