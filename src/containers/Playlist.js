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

  makeSongList = (validItems) => {
    const {
      trackIsFromCurrentPlaylist,
      handleSongUserSelection,
      currentTrack,
    } = this.props

      return validItems.map((item, index) => {
        return (
          <SongItem
            key={item.id}
            song={item}
            isSelected={this.handleIsSelected(item)}
            handleSelection={() => handleSongUserSelection(item)} />
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

  makeSongRejectList = (rejects) => {
      return rejects.map(item => {
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
      currentOpenPlaylistRejects,
    } = this.props

    if (isCurrentPlaylistLoaded && currentOpenPlaylist) {
      const renderList = this.makeSongList(currentOpenPlaylist.contents, handlePlaylistSelect)
      const rejectList = this.makeSongRejectList(currentOpenPlaylistRejects)

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
