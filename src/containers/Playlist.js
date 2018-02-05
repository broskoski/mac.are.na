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
      idOfCurrentTrack,
      handleSongSelection,
      currentTrackInfo,
    } = this.props


    return validatedPlaylist.filter(item => item.macarenaURLValidity.isValid)
      .map((item, index) => {
        const isSelected = trackIsFromCurrentPlaylist && idOfCurrentTrack === item.id && currentTrackInfo
        return (
          <SongItem
            key={item.id}
            song={item}
            isSelected={isSelected}
            handleSelection={() => handleSongSelection(item)} />
        )
      })
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
      const sortedList = sortChannelContents(withValidation, playlistSortObj)
      const renderList = this.makeSongList(sortedList, handlePlaylistSelect)
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
