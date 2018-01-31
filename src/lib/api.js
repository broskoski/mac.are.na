import { apiBase, playlistChannel } from '../config'
const BASE = apiBase[process.env.NODE_ENV]

const parse = {
  playlistList: (a) => a.contents,
  playlist: (a) => a,
  playlistListLength: (a) => a.length,
}

class tinyAPI {
  get = (endpoint) => {
    return fetch(endpoint)
      .then(response => response.json())
      .catch(err => console.error('ruh roh,', err))
  }

  getBlockCount = () => {
    return this.get(`${BASE}/channels/${playlistChannel}/thumb`)
      .then(data => parse.playlistListLength(data))
  }

  getPaginatedChannelContents = (pageIndex, per) => {
    return this.get(`${BASE}/channels/${playlistChannel}/contents?page=${pageIndex}&per=${per}`)
      .then(data => parse.playlistList(data) )
  }

  getFullChannel = (playlistID, pagination) => {
    return this.get(`${BASE}/channels/${playlistID}`)
      .then(data => parse.playlist(data) )
  }
}

module.exports = {
  tinyAPI,
}
