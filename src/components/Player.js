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
import { getURL } from '../lib/helpers'

// this is such a weirdo component
class Player extends Component {
  componentDidMount = () => {
    this.props.returnRef(this.player)
  }

  ref = player => {
    this.player = player
  }

  render () {
    const {
      isPlaying,
      handlePlayback,
      goToNextTrack,
      goToPreviousTrack,
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

    const playbackSymbol = isPlaying
      ? <img alt={'pause'} src={pauseSVG} />
      : <img alt={'play'} src={playSVG} />

    const timeFormat = trackDuration > 3600 ? 'H:m:ss' : 'm:ss'
    const progress = moment.utc(trackProgress * 1000).format(timeFormat)
    const duration = moment.utc(trackDuration * 1000).format(timeFormat)

    const time =`${progress} / ${duration}`

    const config = {
      soundcloud: {
        clientId: process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID
      }
    }

    // lmao jfc
    const style = {
      position: 'fixed',
      visibility: 'hidden',
      transform: 'translate(-10000px)',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }

    return (
      <nav>
        <button onClick={() => goToPreviousTrack()}><img alt={'rev'} src={reverseSVG} /></button>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <button onClick={() => goToNextTrack()}><img alt={'fwd'} src={forwardSVG} /></button>

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
          ref={this.ref}
          url={currentTrackURL}
          playing={isPlaying}
          autoPlay={false}
          hidden={false}
          style={style}
          volume={volume} // 0 to 1
          config={config}
          onReady={(e) => handleOnReady(e)}
          onStart={(e) => handleOnStart(e)}
          onPlay={(e) => handleOnPlay(e)}
          onProgress={(e) => handleOnProgress(e)}
          onDuration={(e) => handleOnDuration(e)}
          onBuffer={(e) => handleOnBuffer(e)}
          onEnded={() => goToNextTrack()}
          onError={(e) => handleOnError(e)} />
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
    const source = getURL(trackInfo)
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
