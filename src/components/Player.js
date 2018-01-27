import React from 'react'
import ReactPlayer from 'react-player'

import { soundcloud } from "../config"
import { classifyItem } from '../lib/classifier'

class Player extends React.Component {

  render () {
    const {
      isPlaying,
      handlePlayback,
      onTrackEnd,
      currentTrackPlaylistSlug,
      currentTrackURL,
    } = this.props

    const playbackSymbol = isPlaying ? '▶' : '▌▌'
    return (
      <nav>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <ReactPlayer
          url={currentTrackURL}
          playing
          hidden={true}
          soundcloudConfig={soundcloud}
          onEnded={() => this.props.onTrackEnd()}
          onError={() => this.props.onTrackEnd()}
        />
      </nav>
    )
  }
}

export default Player
