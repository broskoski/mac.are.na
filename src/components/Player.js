import React, { Component } from 'react'
import ReactPlayer from 'react-player'

import { soundcloud } from "../config"
import { classifyItem } from '../lib/classifier'

class Player extends Component {
  render () {
    const {
      isPlaying,
      handlePlayback,
      goToNextTrack,
      goToPreviousTrack,
      currentTrackPlaylistSlug,
      currentTrackURL,
    } = this.props

    const playbackSymbol = isPlaying ? '▶' : '▌▌'
    return (
      <nav>
        <button onClick={() => goToPreviousTrack()}>{'Previous'}</button>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <button onClick={() => goToNextTrack()}>{'Next'}</button>
        <ReactPlayer
          url={currentTrackURL}
          playing={isPlaying}
          hidden={true}
          soundcloudConfig={soundcloud}
          onEnded={() => goToNextTrack()}
          onError={() => goToNextTrack()}
        />
      </nav>
    )
  }
}

export default Player
