import reactPlayer from 'react-player'
import { message } from './validator'
import { getURL, fillTitle } from './core'

const validatorConfig = {
    whitelists: {
      class: ['Attachement', 'Media'],
      providerName: ['YouTube', 'Vimeo', 'SoundCloud'],
      extension: ['mp3', 'flac', 'wav'],
      state: ['available'],
    },
    sanitizers: {
      cleanURL: block => cleanURL(block),
      fillTitle: block => fillTitle(block.title),
    },
    validators: {
      reactPlayerValidator: block => reactPlayerValidator(block),
    },
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
    result = message(true, 'REACT_PLAYER_CANPLAY', 'React Player can play block')
  } else {
    result = message(false, 'REACT_PLAYER_NOPLAY', 'React Player cannot play block')
  }
  return result
}

/**
 * runs a URL through any number of regexs
 * @param  {collection} block a block or channel from are.na API
 * @return {string URL}       returns a cleaned URL
 */
function cleanURL(block) {
  const url = getURL(block)
  const youtubeRegex = /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/gi

  const youtubeResult = url.match(youtubeRegex)
  if (youtubeResult) {
    return youtubeResult[0]
  }
  return url
}

export default validatorConfig
