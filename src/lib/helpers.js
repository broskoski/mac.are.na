import ReactPlayer from 'react-player'

function makeHash() {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

// only sanitizes youtube, but could support more srcs
function sanitizeURL (url) {
  // in the future (ECMA 2018) we can just return youtubeResult.fullURL which is pretty cool
  // const youtubeRegex = /(?<fullURL>youtu(?:\.be|be\.com)\/(?<youtubeID>?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/gi

  // returns 2 match groups : URL with youtube.com and ID [0], and only ID [1]
  const youtubeRegex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/gi
  const youtubeResult = url.match(youtubeRegex)
  if (youtubeResult) {
    return youtubeResult[0]
  }
  return url
}

// makes a message
function mm(URLValidity, message, item) {
  return { url: URLValidity, message: message, item: item }
}

// our default messages
const message = {
  missing: 'Missing URL 😮',
  class: 'Unplayable block type 😥',
  noPlay: 'Cannot play items from this source 😞',
  valid: 'Valid',
}

// get URL from different types of blocks
function getURL(item) {
  switch(item.class) {
    case 'Attachment': return item.attachment.url
    case 'Media': return item.source.url
    default: return false
  }
}

// this returns a message with information about validation.
// invalid URLs will always have false as it's url key so it can be used with
// array.filter or others
function validateWithMessage(item) {
  let url = getURL(item)
  // catch any glaring issues
  if (url === null) { return mm(false, message.missing, item) }
  if (url === false) { return mm(false, message.class, item) }
  // sanitize our URL with regex
  const sanitizedURL = sanitizeURL(url)
  // copy the item and update it's URL with the sanitized one
  const sanitizedItem = Object.assign({}, {...item}, { macarenaURL: sanitizedURL })
  // check if reactplayer can play
  if (ReactPlayer.canPlay(sanitizedURL)) { return mm(true, message.valid, sanitizedItem) }
  // if nothing has gone well for this URL we just tell it not to play
  return mm(false, message.noPlay, item)
}

// Valid blocks don't need titles so we add one if it is missing
function scrubTitle(title) {
  if (title === null || title === '') {
    return 'Untitled in Are.na'
  }
  return title
}

// get block status
function getStatus(item) {
  switch (item.status){
    case 'public': return 'public'
    case 'closed': return 'closed'
    default: return 'public'
  }
}

const playerStates = {
  idle: 'IDLE',
  buffering: 'BUFFERING',
  playing: 'PLAYING',
  errored: 'ERRORED'
}

// some boilerplate cookie making / getting functions
function setCookie(cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires='+d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie(cname) {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return false
}

// immutable array.reverse in shallow object copy
function reverseChannelContents(channel) {
  return {
    ...channel,
    contents: [...channel.contents.reverse()]
  }
}

const sortKeys = {
  desc: 'DESC',
  asc: 'ASC',
  num: 'NUM',
  title: 'TITLE',
  updated_at: 'UPDATED_AT',
  created_at: 'CREATED_AT'
}

function alphaComparator(a, b) {
  const nameA = a.name.toLowerCase()
  const nameB = b.name.toLowerCase()
  if (nameA < nameB) { return -1 }
  if (nameA > nameB) { return 1 }
  return 0
}

function numComparator(a, b) {
  if (a < b) { return -1 }
  if (a > b) { return 1 }
  return 0
}

function timeComparator(a, b) {
  const dateA = new Date(a)
  const dateB = new Date(b)
  if (dateA < dateB) { return -1 }
  if (dateA > dateB) { return 1 }
  return 0
}

function comparator(a, b, param) {
  switch(param) {
    case sortKeys.title: return alphaComparator(a, b)
    case sortKeys.created_at: return timeComparator(a, b)
    case sortKeys.updated_at: return timeComparator(a, b)
    default: return 0
  }
}

function sortChannelContents(channel, param, order) {
  const channelCopy = { ...channel }
  const contents = channelCopy.contents
  const sortedArr = contents.sort((a, b) => comparator(a, b, param))
  if (order === sortKeys.asc) {
    return {
      ...channelCopy,
      contents: [...sortedArr.reverse()]
    }
  } else {
    return {
      ...channelCopy,
      contents: [...sortedArr]
    }
  }
}


export {
  sanitizeURL,
  makeHash,
  getURL,
  validateWithMessage,
  scrubTitle,
  getStatus,
  playerStates,
  setCookie,
  getCookie,
  reverseChannelContents,
  sortKeys,
  sortChannelContents,
}
