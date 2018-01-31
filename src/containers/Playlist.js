import React, { Component } from 'react'
import { onlySongs, validatePlayability } from '../lib/helpers'
import LoadState from '../components/LoadState'

import { SongItem, SongItemReject } from '../components/SongItem'

class Playlist extends Component {
  componentDidMount() {
    // get slug from router params and return it to <Main />
    const playlistSlug = this.props.match.params.playlistSlug
    this.props.returnSelectedPlaylist(playlistSlug)
    this.props.returnFullRoute(this.props.computedMatch.path)
  }

  makeSongList = (playlist) => {
    const {
      trackIsFromCurrentPlaylist,
      indexOfCurrentTrack,
      handleSongSelection,
      currentTrackInfo,
    } = this.props

    let status = "public"
    switch (playlist.status) {
      case "public":
        status = "public"
        break;
      case "closed":
        status = "closed"
      break;
      default:
        status = "public"
    }

    return playlist.contents.filter(item => validatePlayability(item, true))
      .map((song, index) => {
      return (
        <SongItem
          key={song.id}
          song={song}
          status={status}
          isSelected={trackIsFromCurrentPlaylist && indexOfCurrentTrack === index && currentTrackInfo}
          handleSelection={() => handleSongSelection(song, index)} />
      )
    })
  }

  makeSongRejectList = (playlist) => {
    return playlist.contents.filter(item => validatePlayability(item, false))
      .map((song, index) => {
        return <SongItemReject key={song.id} song={song} />
      })
  }


  render () {
    const { currentOpenPlaylist, isCurrentPlaylistLoaded} = this.props
    if (isCurrentPlaylistLoaded && currentOpenPlaylist) {
      return (
        <div className='w-100 min-vh-100'>
          { this.makeSongList(currentOpenPlaylist) }
          { this.makeSongRejectList(currentOpenPlaylist)}
        </div>
      )
    } else {
      return <LoadState />
    }

  }
}

export default Playlist
