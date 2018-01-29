import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { soundcloud } from "../config"
import { classifyItem } from '../lib/helpers'

class Player extends Component {
  render () {
    const {
      isPlaying,
      handlePlayback,
      goToNextTrack,
      goToPreviousTrack,
      currentTrackPlaylistSlug,
      currentTrackURL,
      handleOnReady,
      handleOnStart,
      handleOnPlay,
      handleOnProgress,
      handleOnDuration,
      handleOnBuffer,
      volume,
      trackProgress,
      trackDuration,
    } = this.props

    const playbackSymbol = isPlaying ? '▌▌' : '▶️'
    const progress = moment.utc(trackProgress*1000).format('H:m:ss')
    const duration = moment.utc(trackDuration*1000).format('H:m:ss')
    const time =`${progress} / ${duration}`
    return (
      <nav>
        <button onClick={() => goToPreviousTrack()}>{'Previous'}</button>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <button onClick={() => goToNextTrack()}>{'Next'}</button>
        <div id={'nowPlaying'}>{time}</div>
        <ReactPlayer
          url={currentTrackURL}
          playing={isPlaying}
          hidden={true}
          volume={volume} // 0 to 1
          soundcloudConfig={soundcloud}
          onReady={(e) => handleOnReady(e)}
          onStart={(e) => handleOnStart(e)}
          onPlay={(e) => handleOnPlay(e)}
          onProgress={(e) => handleOnProgress(e)}
          onDuration={(e) => handleOnDuration(e)}
          onBuffer={(e) => handleOnBuffer(e)}
          onEnded={() => goToNextTrack()}
          onError={() => goToNextTrack()}
        />
      </nav>
    )
  }
}

export default Player
