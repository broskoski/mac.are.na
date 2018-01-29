import React, { Component } from 'react'
import { Pagination } from 'pui-react-pagination'
import { apiBase, playlistChannel } from '../config'
import ListItemLink from '../components/ListItemLink'
import { classifyItem } from '../lib/classifier'

const base = apiBase[process.env.NODE_ENV]


const Playlists = ({
  playlists,
  listLength,
  activePage,
  handlePaginatedPageNav,
  handlePlaylistSelect,
}) => {
  return (
    <div>
      { makePlaylistLinks(playlists, handlePlaylistSelect) }
      <Pagination
        items={listLength}
        onSelect={handlePaginatedPageNav}
        activePage={activePage} />
    </div>
  )
}

const makePlaylistLinks = (playlists, handlePlaylistSelect) => {
  return playlists.map((playlist, index) => {
    const text = `${playlist.user.full_name} / ${decodeURIComponent(playlist.title)}`
    return (
      <ListItemLink
        text={text}
        to={`/playlist/${playlist.slug}`}
        key={playlist.id}
        playlist={playlist}
        handleSelection={() => handlePlaylistSelect(playlist)}/>
      )
  })
}

export default Playlists
