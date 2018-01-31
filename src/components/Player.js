import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { decode } from 'he'
import classnames from 'classnames'

import forwardSVG from '../assets/forward.svg'
import playSVG from '../assets/play.svg'
import reverseSVG from '../assets/reverse.svg'
import pauseSVG from '../assets/pause.svg'
import { returnBlockURL } from '../lib/helpers'

// this is such a weirdo component
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
      handleOnError,
      volume,
      trackProgress,
      trackDuration,
      currentTrackInfo,
      trackIsFromCurrentPlaylist,
      currentTrackPlaylist,
      playerStatus,
      currentRoute,
    } = this.props
    const playbackSymbol = isPlaying ? <img src={pauseSVG} /> : <img src={playSVG} />

    let progress = 0
    let duration = 0

    if (trackDuration > 3600) {
      progress = moment.utc(trackProgress * 1000).format('H:m:ss')
      duration = moment.utc(trackDuration * 1000).format('H:m:ss')
    } else {
      progress = moment.utc(trackProgress * 1000).format('m:ss')
      duration = moment.utc(trackDuration * 1000).format('m:ss')

    }
    const time =`${progress} / ${duration}`

    const config = {
      soundcloud: {
        clientId: process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID
      }
    }

    return (
      <nav>
        <button onClick={() => goToPreviousTrack()}><img src={reverseSVG} /></button>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <button onClick={() => goToNextTrack()}><img src={forwardSVG} /></button>

        <div id={'nowPlaying'}>
          <div id={'nowPlaying-left'}>
            <Dot playerStatus={playerStatus} />
            <TrackTitle
              trackInfo={currentTrackInfo}
              currentTrackPlaylist={currentTrackPlaylist}
              trackIsFromCurrentPlaylist={trackIsFromCurrentPlaylist}
              currentRoute={currentRoute} />
          </div>
          <div id={'nowPlaying-right'}>
            <SourceLink trackInfo={currentTrackInfo} />
            <TrackTime time={time} trackInfo={currentTrackInfo} />
          </div>
        </div>

        <ReactPlayer
          url={currentTrackURL}
          playing={isPlaying}
          hidden={true}
          volume={volume} // 0 to 1
          config={config}
          onReady={(e) => handleOnReady(e)}
          onStart={(e) => handleOnStart(e)}
          onPlay={(e) => handleOnPlay(e)}
          onProgress={(e) => handleOnProgress(e)}
          onDuration={(e) => handleOnDuration(e)}
          onBuffer={(e) => handleOnBuffer(e)}
          onEnded={() => goToNextTrack()}
          onError={() => handleOnError()} />
      </nav>
    )
  }
}


const Dot = ({playerStatus}) => {
  const playerStatusClasses = classnames({
    playerIdle: playerStatus === 'IDLE',
    playerPlaying: playerStatus === 'PLAYING',
    playerBuffering: playerStatus === 'BUFFERING',
    playerErrored: playerStatus === 'ERRORED',
    dot: true,
  })
  return (
    <div className={'tile-wrap-square'}>
      <div key={'dot'} className={playerStatusClasses} />
    </div>
  )
}

const TrackTitle = ({
  trackInfo,
  currentTrackPlaylist,
  trackIsFromCurrentPlaylist,
  currentRoute,
}) => {
  if (trackInfo) {
    const title = decode(trackInfo.title)
    if (!trackIsFromCurrentPlaylist || currentRoute === '/') {
      const playlistSlug = currentTrackPlaylist.slug
      const playListTitle = decode(currentTrackPlaylist.title)
      return (
        <div className={'tile-wrap-full'}>
          <p>{title}
            <Link to={`/playlist/${playlistSlug}`}>{`from ${playListTitle}`}</Link></p>
        </div>
      )
    }

    return (
      <div className={'tile-wrap-full'}>
        <p>{title}</p>
      </div>
    )
  }

  return (
    <div className={'tile-wrap-full'}>
      <p>{':~)'}</p>
    </div>
  )
}

const SourceLink = ({ trackInfo }) => {
  if (trackInfo) {
    const source = returnBlockURL(trackInfo)
    return (
      <div className={'tile-wrap'}>
        <a target={'_blank'} href={`${source}`}>{'Source'}</a>
      </div>
    )
  }
  return (
    <div />
  )
}

const TrackTime = ({ time, trackInfo }) => {
  if (trackInfo) {
    return (
      <div className={'tile-wrap'}>
        <p>{time}</p>
      </div>
    )
  }
  return (
    <div className={'tile-wrap'}>
      <p>{'--:--'}</p>
    </div>

  )
}


export default Player
