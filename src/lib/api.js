import { apiBase, playlistChannel } from '../config'

class tinyAPI {
  get = (endpoint) => {
    return fetch(endpoint)
      .then(response => response.json())
      .error(err => console.error('ruh roh', err))
  }

  getPaginatedPlaylistChannel = (playlistChannel, pageIndex, pagination) => {
    return this.get(`${apiBase}/channels/${playlistChannel}/contents?page=${pageIndex}&per=${pagination}`)
      .then(data => parse.playlistlist(data) )
  }

  getPaginatedPlaylistContents = (playlistID, pagination) => {
    return this.get(`${apiBase}/channels/${playlistID}?per=${pagination}`)
      .then(data => parse.playlist(data) )
  }
}

const parse = {
  playlistlist: (a) => {
    return {
      channels: a.user_id,
    }
  },
  playlist: (a) => {
    return {
      tracks: a.user_id,
    }
  },
}


module.exports = {
  tinyAPI,
}
