import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import moment from 'moment'

import forwardSVG from '../assets/forward.svg'
import playSVG from '../assets/play.svg'
import reverseSVG from '../assets/reverse.svg'
import pauseSVG from '../assets/pause.svg'
import Dot from './Dot'
import TrackTime from './TrackTime'
import TrackTitle from './TrackTitle'
import SourceLink from './SourceLink'

// this is such a weirdo component
class Player extends Component {
  componentDidMount = () => {
    this.props.returnRef(this.player)
  }

  ref = player => {
    this.player = player
  }

  render() {
    const {
      isPlaying,
      handlePlayback,
      goToNextBlock,
      goToPreviousBlock,
      currentBlock,
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
      trackIsFromCurrentChannel,
      channelOfCurrentBlock,
      playerStatus,
      currentRoute
    } = this.props

    const playbackSymbol = isPlaying ? (
      <img alt={'pause'} src={pauseSVG} />
    ) : (
      <img alt={'play'} src={playSVG} />
    )

    const timeFormat = trackDuration > 3600 ? 'H:m:ss' : 'm:ss'
    const progress = moment.utc(trackProgress * 1000).format(timeFormat)
    const duration = moment.utc(trackDuration * 1000).format(timeFormat)
    const time = `${progress} / ${duration}`

    const config = {
      soundcloud: {
        clientId: process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID
      }
    }

    // in safari, iframes needs to be at lease 1px x 1px to play.
    const style = {
      position: 'fixed',
      visibility: 'hidden',
      transform: 'translate(-10000px)',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    }

    return (
      <nav>
        <div id="playPause">
          <button onClick={() => goToPreviousBlock()}>
            <img alt="rev" src={reverseSVG} />
          </button>
          <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
          <button onClick={() => goToNextBlock()}>
            <img alt="fwd" src={forwardSVG} />
          </button>
        </div>
        <div id="nowPlaying">
          <div className={'left'}>
            <Dot playerStatus={playerStatus} />
            <TrackTitle
              trackInfo={currentBlock}
              channelOfCurrentBlock={channelOfCurrentBlock}
              trackIsFromCurrentChannel={trackIsFromCurrentChannel}
              currentRoute={currentRoute} />
          </div>
          <div className={'right'}>
            <SourceLink trackInfo={currentBlock} />
            <TrackTime time={time} trackInfo={currentBlock} />
          </div>
        </div>

        <ReactPlayer
          ref={this.ref}
          url={currentBlock ? currentBlock.macarenaURL : ''}
          playing={isPlaying}
          autoPlay={false}
          hidden={false}
          style={style}
          volume={volume} // 0 to 1
          config={config}
          onReady={e => handleOnReady(e)}
          onStart={e => handleOnStart(e)}
          onPlay={e => handleOnPlay(e)}
          onProgress={e => handleOnProgress(e)}
          onDuration={e => handleOnDuration(e)}
          onBuffer={e => handleOnBuffer(e)}
          onEnded={() => goToNextBlock()}
          onError={e => handleOnError(e)}
        />
      </nav>
    )
  }
}

Player.propTypes = {
  isPlaying: PropTypes.bool,
  handlePlayback: PropTypes.func,
  goToNextBlock: PropTypes.func,
  goToPreviousBlock: PropTypes.func,
  currentBlock: PropTypes.any,
  handleOnReady: PropTypes.func,
  handleOnStart: PropTypes.func,
  handleOnPlay: PropTypes.func,
  handleOnProgress: PropTypes.func,
  handleOnDuration: PropTypes.func,
  handleOnBuffer: PropTypes.func,
  handleOnError: PropTypes.func,
  volume: PropTypes.number,
  trackProgress: PropTypes.number,
  trackDuration: PropTypes.number,
  trackIsFromCurrentChannel: PropTypes.bool,
  channelOfCurrentBlock: PropTypes.object,
  playerStatus: PropTypes.any,
  currentRoute: PropTypes.string,
  returnRef: PropTypes.func
}

export default Player
