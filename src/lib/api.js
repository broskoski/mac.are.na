import { apiBase, playlistChannel } from '../config'
const BASE = apiBase[process.env.NODE_ENV]

const parse = {
  playlistChannel: (a) => a,
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

  //this may be broken
  getPaginatedChannelContents = (pageIndex, per) => {
    return this.get(`${BASE}/channels/${playlistChannel}/contents?page=${pageIndex}&per=${per}`)
      .then(data => parse.playlistChannel(data) )
  }

  getChannelContents = () => {
    return this.get(`${BASE}/channels/${playlistChannel}/contents`)
      .then(data => parse.playlistChannel(data) )
  }

  getFullChannel = (playlistID, pagination) => {
    return this.get(`${BASE}/channels/${playlistID}`)
      .then(data => parse.playlist(data) )
  }
}

module.exports = {
  tinyAPI,
}
