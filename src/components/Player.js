import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import moment from 'moment'

import forwardSVG from '../assets/forward.svg'
import playSVG from '../assets/play.svg'
import reverseSVG from '../assets/reverse.svg'
import pauseSVG from '../assets/pause.svg'
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
      currentTrackInfo,
    } = this.props
    const playbackSymbol = isPlaying ? <img src={pauseSVG} /> : <img src={playSVG} />
    const progress = moment.utc(trackProgress*1000).format('H:m:ss')
    const duration = moment.utc(trackDuration*1000).format('H:m:ss')
    const time =`${progress} / ${duration}`
    const nowPlaying = currentTrackInfo
      ? `Now Playing: ${decodeURIComponent(currentTrackInfo.title)}` : ''
    return (
      <nav>
        <button onClick={() => goToPreviousTrack()}><img src={reverseSVG} /></button>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <button onClick={() => goToNextTrack()}><img src={forwardSVG} /></button>
        <div id={'nowPlaying'}>
          <p>{nowPlaying}</p>
          <p>{time}</p>
        </div>
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
