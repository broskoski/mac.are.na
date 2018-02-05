import React, { Component } from 'react'
import { decode } from 'he'
import { getStatus, sortChannelContents } from '../lib/helpers'

import LinkItem from '../components/LinkItem'
import LoadState from '../components/LoadState'

class Playlists extends Component {
  componentDidMount() {
    // make app aware of current route
    this.props.returnFullRoute(this.props.computedMatch.path)
  }

  // take an array of playlists and make a list of link components
  makePlaylistLinks = (playlists, handlePlaylistSelect) => {
    return playlists.map((playlist, index) => {
      const text = decode(`${playlist.user.full_name} / ${playlist.title}`)
      return (
        <LinkItem
          text={text}
          status={getStatus(playlist)}
          to={`/playlist/${playlist.slug}`}
          key={playlist.id}
          playlist={playlist}
          handleSelection={() => handlePlaylistSelect(playlist)}/>
        )
    })
  }

  // filter by single search predicate
  filterByQuery = (list, predicate) => {
    return list.filter((playlist, index) => {
      const text = decode(`${playlist.user.full_name} / ${playlist.title}`)
      const match = text.toLowerCase().indexOf(predicate.toLowerCase()) > -1
      return match
    })
  }

  render() {
    const {
      handlePlaylistSelect,
      playlistChannel,
      searchQuery,
      playlistChannelSortObj,
      currentRoute,
    } = this.props
    if (playlistChannel) {

      const filteredList = searchQuery !== ''
        ? this.filterByQuery(playlistChannel.contents, searchQuery)
        : playlistChannel.contents

      const sortedList = sortChannelContents(filteredList, playlistChannelSortObj)

      const renderList = this.makePlaylistLinks(sortedList, handlePlaylistSelect)

      return (
        <div>
          { renderList }
        </div>
      )
    } else {
      return (
        <LoadState />
      )
    }
  }
}





export default Playlists
