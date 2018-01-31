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

// sort valid are.na schema class and return source URL. If no valid URL, return false
function classifyItemURL(item) {
  let result
  switch(item.class) {
    case 'Attachment':
      result = item.attachment.url ? item.attachment.url : false
      break
    case 'Media':
      result = item.source.url ? sanitizeURL(item.source.url) : false
      break
    default: result = false
  }
  return result
}

// determine if URL can be played by react-player. You can set the returnMatch
// arg to return falsies or truthies to display rejects in a separate list
function validatePlayability(item, predicate) {
  const url = classifyItemURL(item)
  if (url && predicate === true) {
    return ReactPlayer.canPlay(url)
  } else if (predicate === false){
    return !ReactPlayer.canPlay(url) || !url
  }
  return false
}

function scrubTitle(title) {
  if (title === null || title === '') {
    return 'Untitled in Are.na'
  }
  return title
}

function getStatus(item) {
  switch (item.status){
    case "public": return "public"
    case "closed": return "closed"
    default: return "public"
  }
}


export {
  sanitizeURL,
  classifyItemURL,
  makeHash,
  validatePlayability,
  scrubTitle,
  getStatus,
}
