import reactPlayer from 'react-player'
import { mark } from './validator'
import { getURL, fillTitle } from './core'

const validatorConfig = {
  whitelists: {
    class: ['Attachement', 'Media'],
    'source.provider.name': ['YouTube', 'Vimeo', 'SoundCloud'],
    'attachment.extension': ['mp3', 'flac', 'wav'],
    state: ['available']
  },
  sanitizers: {
    cleanURL: a => cleanURL(a),
    fillTitle: a => fillTitle(a.title)
  },
  validators: {
    reactPlayerValidator: a => reactPlayerValidator(a)
  }
}

/**
 * pretty much just runs reactPlayer.canPlay() and returns a message with the result
 * @param  {collection} block a block or channel from are.na API
 * @return {message}          a validation message
 */
function reactPlayerValidator(block) {
  const url = getURL(block)
  let result
  if (reactPlayer.canPlay(url)) {
    result = mark(true, 'REACT_PLAYER_CANPLAY')
  } else {
    result = mark(false, 'REACT_PLAYER_NOPLAY')
  }
  return result
}

/**
 * runs a URL through any number of regexs
 * @param  {collection} block a block or channel from are.na API
 * @return {string URL}       returns a cleaned URL
 */
function cleanURL(block) {
  const youtubeRegex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/gi
  const url = getURL(block)
  if (url) {
    const youtubeResult = url.match(youtubeRegex)
    if (youtubeResult) {
      return youtubeResult[0]
    }
  }
  return url
}

export default validatorConfig
