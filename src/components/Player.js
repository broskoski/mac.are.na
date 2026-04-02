import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'

import { scrubTitle } from '../lib/helpers'

class Player extends Component {
  componentDidMount = () => {
    this.props.returnRef(this.player)
  }

  ref = player => {
    this.player = player
  }

  formatTime = seconds => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  render() {
    const {
      isPlaying,
      handlePlayback,
      goToNextTrack,
      goToPreviousTrack,
      currentTrack,
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
      playerStatus,
    } = this.props

    const progress = this.formatTime(trackProgress)
    const duration = this.formatTime(trackDuration)
    const progressPercent =
      trackDuration > 0 ? trackProgress / trackDuration * 100 : 0

    const trackTitle = currentTrack ? scrubTitle(currentTrack.title) : ''
    const statusText =
      playerStatus === 'BUFFERING'
        ? 'Loading...'
        : playerStatus === 'ERRORED' ? 'Error' : ''

    const config = {
      soundcloud: {
        clientId: process.env.REACT_APP_SOUNDCLOUD_CLIENT_ID,
      },
    }

    const playerStyle = {
      position: 'fixed',
      visibility: 'hidden',
      transform: 'translate(-10000px)',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }

    return (
      <div id="player">
        <div id="transport">
          <button className="transport-btn" onClick={goToPreviousTrack}>
            <svg viewBox="0 0 24 24" width="14" height="14">
              <polygon points="4,4 4,20 6,20 6,4" fill="currentColor" />
              <polygon points="6,12 20,4 20,20" fill="currentColor" />
            </svg>
          </button>
          <button className="transport-btn play-btn" onClick={handlePlayback}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="16" height="16">
                <rect x="5" y="3" width="5" height="18" fill="currentColor" />
                <rect x="14" y="3" width="5" height="18" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16">
                <polygon points="5,3 21,12 5,21" fill="currentColor" />
              </svg>
            )}
          </button>
          <button className="transport-btn" onClick={goToNextTrack}>
            <svg viewBox="0 0 24 24" width="14" height="14">
              <polygon points="4,4 18,12 4,20" fill="currentColor" />
              <polygon points="18,4 20,4 20,20 18,20" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div id="lcd-display">
          <div id="lcd-info">
            <span id="lcd-title">
              {statusText || trackTitle || 'mac.are.na'}
            </span>
            {currentTrack && (
              <span id="lcd-time">
                {progress} / {duration}
              </span>
            )}
          </div>
          <div id="lcd-progress-bar">
            <div
              id="lcd-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div id="volume-control">
          <svg viewBox="0 0 24 24" width="12" height="12" className="vol-icon">
            <polygon
              points="2,8 6,8 12,3 12,21 6,16 2,16"
              fill="currentColor"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            className="volume-slider"
            readOnly
          />
          <svg viewBox="0 0 24 24" width="12" height="12" className="vol-icon">
            <polygon
              points="2,8 6,8 12,3 12,21 6,16 2,16"
              fill="currentColor"
            />
            <path
              d="M15,8 Q19,12 15,16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <ReactPlayer
          ref={this.ref}
          url={currentTrack ? currentTrack.macarenaURL : ''}
          playing={isPlaying}
          autoPlay={false}
          hidden={false}
          style={playerStyle}
          volume={volume}
          config={config}
          onReady={handleOnReady}
          onStart={handleOnStart}
          onPlay={handleOnPlay}
          onProgress={handleOnProgress}
          onDuration={handleOnDuration}
          onBuffer={handleOnBuffer}
          onEnded={goToNextTrack}
          onError={handleOnError}
        />
      </div>
    )
  }
}

Player.propTypes = {
  isPlaying: PropTypes.bool,
  handlePlayback: PropTypes.func,
  goToNextTrack: PropTypes.func,
  goToPreviousTrack: PropTypes.func,
  currentTrack: PropTypes.any,
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
  playerStatus: PropTypes.any,
  returnRef: PropTypes.func,
}

export default Player
