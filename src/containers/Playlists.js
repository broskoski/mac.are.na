import React, { Component } from 'react'
import { Pagination } from 'pui-react-pagination'
import { apiBase, playlistChannel } from '../config'
import LinkItem from '../components/LinkItem'
import { classifyItem } from '../lib/helpers'

const Playlists = ({
  playlists,
  listLength,
  activePage,
  handlePaginatedPageNav,
  handlePlaylistSelect,
}) => {
  if (playlists) {
    return (
      <div>
        { makePlaylistLinks(playlists, handlePlaylistSelect) }
        <Pagination
          items={listLength}
          onSelect={handlePaginatedPageNav}
          activePage={activePage} />
      </div>
    )
  } else {
    return null
  }
}

const makePlaylistLinks = (playlists, handlePlaylistSelect) => {
  return playlists.map((playlist, index) => {
    const text = `${playlist.user.full_name} / ${decodeURIComponent(playlist.title)}`
    return (
      <LinkItem
        text={text}
        to={`/playlist/${playlist.slug}`}
        key={playlist.id}
        playlist={playlist}
        handleSelection={() => handlePlaylistSelect(playlist)}/>
      )
  })
}

export default Playlists
