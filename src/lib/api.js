import { apiBase, playlistChannel } from '../config'
const BASE = apiBase[process.env.NODE_ENV]

class tinyAPI {
  get = (endpoint) => {
    return fetch(endpoint)
      .then(response => response.json())
      .catch(err => console.error('ruh roh,', err))
  }

  getPlaylistChannelLength = () => {
    return this.get(`${BASE}/channels/${playlistChannel}/thumb`)
      .then(data => parse.playlistListLength(data))
  }

  getPaginatedPlaylistList = (pageIndex, pagination) => {
    return this.get(`${BASE}/channels/${playlistChannel}/contents?page=${pageIndex}&per=${pagination}`)
      .then(data => parse.playlistList(data) )
  }

  getPaginatedPlaylistContents = (playlistID, pagination) => {
    return this.get(`${BASE}/channels/${playlistID}?per=${pagination}`)
      .then(data => parse.playlist(data) )
  }
}

const parse = {
  playlistList: (a) => a.contents,
  playlist: (a) => a.contents,
  playlistListLength: (a) => a.length,
}


module.exports = {
  tinyAPI,
}
