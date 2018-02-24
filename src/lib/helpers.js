import ReactPlayer from 'react-player'
import { fillTitle, getStatus } from './core'

function makeHash() {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

const playerStates = {
  idle: 'IDLE',
  buffering: 'BUFFERING',
  playing: 'PLAYING',
  errored: 'ERRORED'
}

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

function immutablyChangeContents(newContents, channel) {
  return {
    ...channel,
    contents: newContents
  }
}

function incrementInList(list, currentIndex) {
  const listLength = list.length
  if (currentIndex + 1 < listLength) {
    return list[currentIndex + 1]
  }
  return false
}

function decrementInList(list, currentIndex) {
  if (currentIndex > 0) {
    return list[currentIndex - 1]
  }
  return false
}

export {
  makeHash,
  getStatus,
  playerStates,
  sortKeys,
  sortChannelContents,
  immutablyChangeContents,
  incrementInList,
  decrementInList
}
