import React, { Component } from 'react'
import classnames from 'classnames'
import { onlySongs } from '../lib/helpers'

import SongItem from '../components/SongItem'

class Playlist extends Component {
  componentDidMount() {
    // get slug from router params and return it to <Main />
    const playlistSlug = this.props.match.params.playlistSlug
    this.props.returnSelectedPlaylist(playlistSlug)
    this.props.returnFullRoute(this.props.computedMatch.path)
  }

  makeSongList = (playlist) => {
    if (playlist) {
    const {
      trackIsFromCurrentPlaylist,
      indexOfCurrentTrack,
      isPlaying,
      handleSongSelection,
      currentTrackInfo,
    } = this.props
      return onlySongs(playlist.contents).map((song, index) => {
        return (
          <SongItem
            key={song.id}
            song={song}
            isSelected={trackIsFromCurrentPlaylist && indexOfCurrentTrack === index && currentTrackInfo}
            handleSelection={() => handleSongSelection(song, index)} />
        )
      })
    }
  }

  render () {
    const { currentOpenPlaylist, isCurrentPlaylistLoaded} = this.props
    if (isCurrentPlaylistLoaded) {
      return (
        <div className='w-100 min-vh-100'>
          {this.makeSongList(currentOpenPlaylist)}
        </div>
      )
    } else {
      return <div/>
    }

  }
}

export default Playlist
