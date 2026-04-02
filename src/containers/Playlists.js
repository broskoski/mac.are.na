import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { decode } from 'he'
import { getStatus, sortChannelContents } from '../lib/helpers'

import LoadState from '../components/LoadState'

class Playlists extends Component {
  filterByQuery = (list, predicate) => {
    return list.filter(playlist => {
      const text = decode(`${playlist.owner.name} / ${playlist.title}`)
      return text.toLowerCase().indexOf(predicate.toLowerCase()) > -1
    })
  }

  render() {
    const {
      playlistChannel,
      searchQuery,
      playlistChannelSortObj,
      selectedPlaylistSlug,
      selectPlaylist,
    } = this.props

    if (!playlistChannel) {
      return <LoadState />
    }

    const filteredList =
      searchQuery !== ''
        ? this.filterByQuery(playlistChannel.contents, searchQuery)
        : playlistChannel.contents

    const sortedList = sortChannelContents(filteredList, playlistChannelSortObj)

    return (
      <ul className="source-items">
        {sortedList.map(playlist => {
          const isSelected = selectedPlaylistSlug === playlist.slug
          const status = getStatus(playlist)
          return (
            <li
              key={playlist.id}
              className={`source-item ${status} ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => selectPlaylist(playlist.slug)}
            >
              {decode(playlist.title)}
            </li>
          )
        })}
      </ul>
    )
  }
}

Playlists.propTypes = {
  playlistChannel: PropTypes.any,
  searchQuery: PropTypes.string,
  playlistChannelSortObj: PropTypes.any,
  selectedPlaylistSlug: PropTypes.string,
  selectPlaylist: PropTypes.func,
}

export default Playlists
