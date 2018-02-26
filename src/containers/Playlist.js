import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LoadState from '../components/LoadState'
import ToggleRejectedSongs from '../components/ToggleRejectedSongs'
import { SongItem, SongItemReject } from '../components/SongItem'

class Playlist extends Component {
  componentDidMount() {
    // get slug from router params and return it to <Main />
    const {
      match,
      setSelectedChannel,
      setCurrentRoute,
      computedMatch
    } = this.props

    const playlistSlug = match.params.playlistSlug
    setSelectedChannel(playlistSlug)
    setCurrentRoute(computedMatch.path)
  }

  makeSongList = validItems => {
    const { handleBlockUserSelection } = this.props

    return validItems.map((block, index) => {
      return (
        <SongItem
          key={block.id}
          block={block}
          isSelected={this.handleIsSelected(block)}
          handleSelection={() => handleBlockUserSelection(block)}
        />
      )
    })
  }

  handleIsSelected = item => {
    const { trackIsFromCurrentPlaylist, currentTrack } = this.props
    if (currentTrack) {
      if (currentTrack.id === item.id && trackIsFromCurrentPlaylist) {
        return true
      }
    }
    return false
  }

  makeSongRejectList = rejects => {
    return rejects.map(item => {
      return (
        <SongItemReject
          message={item.macarenaURLValidity.message}
          key={item.id}
          song={item}
        />
      )
    })
  }

  render() {
    const {
      currentOpenPlaylist,
      isCurrentPlaylistLoaded,
      handlePlaylistSelect,
      currentOpenPlaylistRejects,
      toggleShowRejects,
      showRejects
    } = this.props

    if (isCurrentPlaylistLoaded && currentOpenPlaylist) {
      const renderList = this.makeSongList(
        currentOpenPlaylist.contents,
        handlePlaylistSelect
      )
      const rejectCount = currentOpenPlaylistRejects.length
      return (
        <div className="w-100 min-vh-100">
          {renderList}
          {showRejects ? (
            this.makeSongRejectList(currentOpenPlaylistRejects)
          ) : (
            <div />
          )}
          {rejectCount > 0 ? (
            <ToggleRejectedSongs
              toggleShowRejects={toggleShowRejects}
              rejectCount={rejectCount}
              showRejects={showRejects}
            />
          ) : (
            <div />
          )}
        </div>
      )
    } else {
      return <LoadState />
    }
  }
}

Playlist.propTypes = {
  match: PropTypes.any,
  setSelectedChannel: PropTypes.func,
  setCurrentRoute: PropTypes.func,
  computedMatch: PropTypes.any,
  handleBlockUserSelection: PropTypes.func,
  currentTrack: PropTypes.any,
  trackIsFromCurrentPlaylist: PropTypes.bool,
  currentOpenPlaylist: PropTypes.any,
  isCurrentPlaylistLoaded: PropTypes.bool,
  handlePlaylistSelect: PropTypes.func,
  currentOpenPlaylistRejects: PropTypes.any,
  toggleShowRejects: PropTypes.func,
  showRejects: PropTypes.bool
}

export default Playlist
