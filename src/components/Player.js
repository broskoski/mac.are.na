import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { decode } from 'he'

import forwardSVG from '../assets/forward.svg'
import playSVG from '../assets/play.svg'
import reverseSVG from '../assets/reverse.svg'
import pauseSVG from '../assets/pause.svg'
import { soundcloud } from "../config"
import { classifyItem } from '../lib/helpers'

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
      volume,
      trackProgress,
      trackDuration,
      currentTrackInfo,
      trackIsFromCurrentPlaylist,
      currentTrackPlaylist,
    } = this.props
    const playbackSymbol = isPlaying ? <img src={pauseSVG} /> : <img src={playSVG} />

    const progress = moment.utc(trackProgress * 1000).format('H:m:ss')
    const duration = moment.utc(trackDuration * 1000).format('H:m:ss')
    const time =`${progress} / ${duration}`

    const handleNowPlaying = currentTrackPlaylist
      ? <NowPlaying
        currentTrackPlaylist={currentTrackPlaylist}
        currentTrackInfo={currentTrackInfo}
        trackIsFromCurrentPlaylist={trackIsFromCurrentPlaylist}
        time={time} />
      : <ArenaLogo />

    return (
      <nav>
        <button onClick={() => goToPreviousTrack()}><img src={reverseSVG} /></button>
        <button onClick={() => handlePlayback()}>{playbackSymbol}</button>
        <button onClick={() => goToNextTrack()}><img src={forwardSVG} /></button>
        <div id={'nowPlaying'}>{ handleNowPlaying }</div>
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
          onError={() => goToNextTrack()} />
      </nav>
    )
  }
}



const ArenaLogo = () => {
  return <p id={'nowPlaying'}>{'~'}</p>
}

// lol i am sorry for this sinful component
const NowPlaying = ({
  time,
  currentTrackInfo,
  trackIsFromCurrentPlaylist,
  currentTrackPlaylist,
}) => {
  return [
      <TitleText
        key={'tt'}
        title={decode(currentTrackInfo.title)}
        trackIsFromCurrentPlaylist={trackIsFromCurrentPlaylist}
        playlistSlug={currentTrackPlaylist.slug}
        playListName={decode(currentTrackPlaylist.title)} />,
      <p key={'p'}>{time}</p>
    ]
}

const TitleText = ({
  title,
  playlistSlug,
  playListName,
  trackIsFromCurrentPlaylist
}) => {
  if (trackIsFromCurrentPlaylist) {
    return <div id={'nowPlaying-title'}><p>{`Now Playing: ${title}`}</p></div>
  } else {
    return (
      <div id={'nowPlaying-title'}>
        <p key={'np'}>{`Now Playing: ${title} `}
        <Link key={'linkto'} to={`/playlist/${playlistSlug}`}>{`from ${playListName}`}</Link></p>
      </div>
    )
  }
}


export default Player
