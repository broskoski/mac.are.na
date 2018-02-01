import ReactPlayer from 'react-player'

function makeHash() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

// right now this only sanitizes youtube, but eventual it could support more srcs
function sanitizeURL (url) {
  // returns 2 match groups : URL with youtube.com and ID [0], and only ID [1]
  const youtubeRegex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/gi
  const result = url.match(youtubeRegex)
  if (result) {
    return result[0]
  }
  return url
}

// makes a message
function mm(url, message, item) {
  return { url: url, message: message, item: item }
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
  let result
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
  // sanitize URL (only youtube right now)
  url = sanitizeURL(url)
  // check if reactplayer can play
  if (ReactPlayer.canPlay(url)) { return mm(url, message.valid, item) }
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
    case "public": return "public"
    case "closed": return "closed"
    default: return "public"
  }
}


export {
  sanitizeURL,
  makeHash,
  getURL,
  validateWithMessage,
  scrubTitle,
  getStatus,
}
