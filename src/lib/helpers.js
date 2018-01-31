import ReactPlayer from 'react-player'

function makeHash() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

function getYoutubeId (url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : false
}

// sort valid are.na schema class and return source URL. If no valid URL, return false
function classifyItemURL(item) {
  switch(item.class) {
    case 'Attachment':
      return item.attachment.url ? item.attachment.url : false
    case 'Media':
      return item.source.url ? item.source.url : false
    default: return false
  }
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

export {
  getYoutubeId,
  classifyItemURL,
  makeHash,
  validatePlayability,
  scrubTitle,
}
