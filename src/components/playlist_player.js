import React from 'react'
import SoundCloudAudio from 'soundcloud-audio'
import Youtube from 'react-youtube'
import Sound from 'react-sound'
import { classifyItem } from '../lib/classifier'
import { soundcloud } from '../config'
import { getYoutubeId } from '../lib/youtube'

const scPlayer = new SoundCloudAudio(soundcloud.clientID)
const youtubeOptions = {
  height: '390',
  width: '640',
  playerVars: { 
    autoplay: 1
  }
};

class PlaylistPlayer extends React.Component {
  render () {
    const item = this.props.item
    let el = <div/>;
    if (!item) return (el)

    const type = classifyItem(item)
    switch (type) {
      case 'soundcloud':
        scPlayer.resolve(item.source.url, () => {
          scPlayer.play()
        })
        break;
      
      case 'youtube':
        const id = getYoutubeId(item.source.url)
        el = (
          <div style={{display: 'none'}}>
            <Youtube
              opts={youtubeOptions}
              videoId={id} 
            />
          </div>
        )
        console.log('playing youtube')
        break;
      
      case 'mp3':
        el = (
          <Sound
            url={item.attachment.url}
            playStatus="PLAYING"
          />
        )
        break;
    
      default:
        break;
    }
    return (el)
  }
}

export default PlaylistPlayer