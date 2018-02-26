import { apiBase } from '../config'
const BASE = apiBase[process.env.NODE_ENV]

const parse = {
  playlistChannel: a => a,
  paginatedPlaylistChannel: a => a.contents,
  playlist: a => a,
  playlistListLength: a => a.length
}

class TinyAPI {
  get = endpoint => {
    return fetch(endpoint)
      .then(response => response.json())
      .catch(err => console.error(err))
  }

  getBlockCount = (slug) => {
    return this.get(`${BASE}/channels/${slug}/thumb`).then(data =>
      parse.playlistListLength(data)
    )
  }

  getPaginatedChannelContents = (slug, pageIndex, per) => {
    return this.get(
      `${BASE}/channels/${slug}/contents?page=${pageIndex}&per=${per}`
    ).then(data => parse.paginatedPlaylistChannel(data))
  }

  getChannelContents = (slug) => {
    return this.get(`${BASE}/channels/${slug}/contents`).then(data =>
      parse.playlistChannel(data)
    )
  }

  getFullChannel = (slug, pagination) => {
    return this.get(`${BASE}/channels/${slug}`).then(data =>
      parse.playlist(data)
    )
  }
}

export { TinyAPI }
