import React from 'react'
import ReactPlayer from 'react-player'

import { soundcloud } from "../config"
import { classifyItem } from '../lib/classifier'

class PlaylistPlayer extends React.Component {
  render () {
    const item = this.props.item
    if (!item) return (<div/>)

    const type = classifyItem(item)
    let url = ""

    if (type === 'mp3') {
      url = item.attachment.url
    } else {
      url = item.source.url
    }

    return (
      <ReactPlayer 
        url={url}
        playing
        hidden={true}
        soundcloudConfig={soundcloud}
        onEnded={() => this.props.onTrackEnd()}
      />
    )
  }
}

export default PlaylistPlayer