import React, { Component } from 'react'
import { validateWithMessage, sortChannelContents } from '../lib/helpers'
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
      handleSongSelection,
      currentTrack,
    } = this.props

    return validatedPlaylist.filter(item => item.macarenaURLValidity.isValid)
      .map((item, index) => {
        return (
          <SongItem
            key={item.id}
            song={item}
            isSelected={this.handleIsSelected(item)}
            handleSelection={() => handleSongSelection(item, true)} />
        )
      })
  }

  handleIsSelected = (item) => {
    const {
      trackIsFromCurrentPlaylist,
      currentTrack,
    } = this.props
    if (currentTrack) {
      if (currentTrack.id === item.id && trackIsFromCurrentPlaylist) {
        return true
      }
    }
    return false
  }

  makeSongRejectList = (validatedPlaylist) => {
    return validatedPlaylist.filter(item => !item.macarenaURLValidity.isValid)
      .map(item => {
        return <SongItemReject message={item.macarenaURLValidity.message} key={item.id} song={item} />
      })
  }

  render () {
    const {
      currentOpenPlaylist,
      isCurrentPlaylistLoaded,
      handlePlaylistSelect,
      playlistSortObj,
      currentRoute,
    } = this.props

    if (isCurrentPlaylistLoaded && currentOpenPlaylist) {
      const withValidation = currentOpenPlaylist.contents.map(item => validateWithMessage(item))
      // const sortedList = sortChannelContents(withValidation, playlistSortObj)
      const renderList = this.makeSongList(withValidation, handlePlaylistSelect)
      const rejectList = this.makeSongRejectList(withValidation)

      return (
        <div className='w-100 min-vh-100'>
          { renderList }
          { rejectList }
        </div>
      )
    } else {
      return <LoadState />
    }

  }
}

export default Playlist
