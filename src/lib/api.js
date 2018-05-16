import { apiBase, playlistChannel } from '../config'
import { flattenDeep } from 'lodash'

const BASE = apiBase[process.env.NODE_ENV]

const parse = {
  playlistChannel: a => a,
  paginatedPlaylistChannel: a => a.contents,
  playlist: a => a,
  playlistListLength: a => a.length,
}

class tinyAPI {
  get = endpoint => {
    return fetch(endpoint)
      .then(response => response.json())
      .catch(err => false)
  }

  getBlockCount = () => {
    return this.get(`${BASE}/channels/${playlistChannel}/thumb`).then(data =>
      parse.playlistListLength(data)
    )
  }

  getPaginatedChannelContents = (pageIndex, per = 25) => {
    return this.get(
      `${BASE}/channels/${playlistChannel}?page=${pageIndex}&per=${per}`
    )
  }

  getChannelContents = () => {
    return this.getFullChannel(playlistChannel).then(data =>
      parse.playlistChannel(data)
    )
  }

  getFullChannel = playlistID => {
    const PER = 100
    const mergedContents = []
    const getChannelPage = page =>
      this.get(`${BASE}/channels/${playlistID}?per=${PER}&page=${page}`)

    return getChannelPage(1).then(channel => {
      mergedContents.push(channel.contents)

      const totalPages = Math.ceil((channel.length - 1) / PER)
      return Array(totalPages)
        .fill(undefined)
        .map((_, pageN) => pageN + 2)
        .reduce(
          (promise, pageN) =>
            promise
              .then(() => getChannelPage(pageN))
              .then(({ contents }) => mergedContents.push(contents)),
          Promise.resolve()
        )
        .then(_ => {
          const entireChannel = Object.assign({}, channel, {
            contents: flattenDeep(mergedContents),
          })
          return entireChannel
        })
    })
  }
}

export { tinyAPI }
