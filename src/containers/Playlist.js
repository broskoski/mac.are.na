import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LoadState from '../components/LoadState'
import { SongItem, SongItemReject, AlbumItem } from '../components/SongItem'
import { sortKeys } from '../lib/helpers'
import sortArrow from '../assets/sortArrow.svg'

class Playlist extends Component {
  handleIsSelected = item => {
    const { trackIsFromCurrentPlaylist, currentTrack } = this.props
    if (currentTrack) {
      if (currentTrack.id === item.id && trackIsFromCurrentPlaylist) {
        return true
      }
    }
    return false
  }

  handleSort = newParamKey => {
    const { playlistSortObj, setSort } = this.props
    if (playlistSortObj.paramKey === newParamKey) {
      setSort({
        stateKey: 'playlist',
        orderKey: !playlistSortObj.orderKey,
        paramKey: playlistSortObj.paramKey,
      })
    } else {
      setSort({
        stateKey: 'playlist',
        orderKey: playlistSortObj.orderKey,
        paramKey: newParamKey,
      })
    }
  }

  renderColumnHeaders = () => {
    const { playlistSortObj } = this.props
    const sortIndicator = paramKey => {
      if (playlistSortObj.paramKey !== paramKey) return null
      return (
        <img
          alt="sort"
          className={`col-sort-arrow ${
            playlistSortObj.orderKey ? 'asc' : 'desc'
          }`}
          src={sortArrow}
        />
      )
    }
    return (
      <div id="column-headers">
        <div className="col col-num">#</div>
        <div
          className="col col-name sortable"
          onClick={() => this.handleSort(sortKeys.title)}
        >
          Name {sortIndicator(sortKeys.title)}
        </div>
        <div
          className="col col-position sortable"
          onClick={() => this.handleSort(sortKeys.position)}
        >
          Position {sortIndicator(sortKeys.position)}
        </div>
      </div>
    )
  }

  render() {
    const {
      currentOpenPlaylist,
      isCurrentPlaylistLoaded,
      currentOpenPlaylistRejects,
      handleSongUserSelection,
      toggleShowRejects,
      showRejects,
      selectedPlaylistSlug,
      viewMode,
    } = this.props

    if (!selectedPlaylistSlug) {
      return (
        <div className="track-list-empty">
          <p>Select a playlist</p>
        </div>
      )
    }

    if (!isCurrentPlaylistLoaded || !currentOpenPlaylist) {
      return <LoadState />
    }

    if (viewMode === 'album') {
      return (
        <div className="track-list-content">
          <div className="album-grid">
            {currentOpenPlaylist.contents.map(item => (
              <AlbumItem
                key={item.id}
                song={item}
                isSelected={this.handleIsSelected(item)}
                handleSelection={() => handleSongUserSelection(item)}
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="track-list-content">
        {this.renderColumnHeaders()}
        <div className="track-rows">
          {currentOpenPlaylist.contents.map((item, index) => (
            <SongItem
              key={item.id}
              song={item}
              index={index + 1}
              isSelected={this.handleIsSelected(item)}
              handleSelection={() => handleSongUserSelection(item)}
            />
          ))}
          {showRejects &&
            currentOpenPlaylistRejects.map(item => (
              <SongItemReject
                key={item.id}
                song={item}
                message={item.macarenaURLValidity.message}
              />
            ))}
        </div>
        {currentOpenPlaylistRejects.length > 0 && (
          <button className="toggle-rejects" onClick={toggleShowRejects}>
            {showRejects ? 'Hide' : 'Show'} {currentOpenPlaylistRejects.length}{' '}
            unplayable
          </button>
        )}
      </div>
    )
  }
}

Playlist.propTypes = {
  currentOpenPlaylist: PropTypes.any,
  isCurrentPlaylistLoaded: PropTypes.bool,
  currentOpenPlaylistRejects: PropTypes.array,
  handleSongUserSelection: PropTypes.func,
  currentTrack: PropTypes.any,
  trackIsFromCurrentPlaylist: PropTypes.bool,
  toggleShowRejects: PropTypes.func,
  showRejects: PropTypes.bool,
  selectedPlaylistSlug: PropTypes.string,
  playlistSortObj: PropTypes.any,
  setSort: PropTypes.func,
  viewMode: PropTypes.string,
}

export default Playlist
