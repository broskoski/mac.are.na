import React, { Component } from 'react'
import { getStatus, validateWithMessage } from '../lib/helpers'
import LoadState from '../components/LoadState'

import { SongItem, SongItemReject } from '../components/SongItem'

class Playlist extends Component {
  componentDidMount() {
    // get slug from router params and return it to <Main />
    const playlistSlug = this.props.match.params.playlistSlug
    this.props.returnSelectedPlaylist(playlistSlug)
    this.props.returnFullRoute(this.props.computedMatch.path)
  }

  makeSongList = (validatedPlaylist) => {
    const {
      trackIsFromCurrentPlaylist,
      indexOfCurrentTrack,
      handleSongSelection,
      currentTrackInfo,
    } = this.props

    return validatedPlaylist.filter(message => message.url).map((message, index) => {
      return (
        <SongItem
          key={message.item.id}
          song={message.item}
          status={getStatus(message.item)}
          isSelected={trackIsFromCurrentPlaylist && indexOfCurrentTrack === index && currentTrackInfo}
          handleSelection={() => handleSongSelection(message.item, index)} />
      )
    })
  }

  makeSongRejectList = (validatedPlaylist) => {
    return validatedPlaylist.filter(message => !message.url).map(message => {
      return <SongItemReject message={message.message} key={message.item.id} song={message.item} />
    })
  }


  render () {
    const { currentOpenPlaylist, isCurrentPlaylistLoaded} = this.props
    if (isCurrentPlaylistLoaded && currentOpenPlaylist) {
      const withValidation = currentOpenPlaylist.contents.map(item => validateWithMessage(item))
      return (
        <div className='w-100 min-vh-100'>
          { this.makeSongList(withValidation) }
          { this.makeSongRejectList(withValidation)}
        </div>
      )
    } else {
      return <LoadState />
    }

  }
}

export default Playlist
