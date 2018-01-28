import React, { Component } from 'react'
import { Pagination } from 'pui-react-pagination'
import { apiBase, playlistChannel } from '../config'
import ListItemLink from '../components/ListItemLink'
import { classifyItem } from '../lib/classifier'

const base = apiBase[process.env.NODE_ENV]


const Playlists = ({ playlists, listLength, activePage }) => {
  return (
    <div className='w-100 min-vh-100 pa3 pa5-ns'>
      { makePlaylistLinks(playlists) }
      <Pagination
        items={listLength}
        onSelect={(event, selectedEvent) => this.handleSelect(event, selectedEvent)}
        activePage={activePage} />
    </div>
  )
}

const makePlaylistLinks = (playlists) => {
  return playlists.map((playlist, index) => {
    return (
      <ListItemLink
        text={`${playlist.user.full_name} / ${decodeURIComponent(playlist.title)}`}
        to={`/playlist/${playlist.slug}`}
        key={playlist.id}
        playlist={playlist}
        handlePlaylistSelect={() => this.handlePlaylistSelect(playlist.id)}/>
      )
  })
}

export default Playlists
