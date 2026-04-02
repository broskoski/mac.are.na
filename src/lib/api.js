import { apiBase, playlistChannel } from '../config'

const BASE = apiBase[process.env.NODE_ENV]

class tinyAPI {
  get = endpoint => {
    return fetch(endpoint)
      .then(response => response.json())
      .catch(err => false)
  }

  getBlockCount = () => {
    return this.get(`${BASE}/channels/${playlistChannel}`).then(
      data => data.counts.contents
    )
  }

  getChannelContents = () => {
    return this.getFullChannel(playlistChannel)
  }

  getFullChannel = playlistID => {
    const PER = 100
    const allContents = []

    const getContentsPage = page =>
      this.get(
        `${BASE}/channels/${playlistID}/contents?per=${PER}&page=${page}`
      )

    return this.get(`${BASE}/channels/${playlistID}`).then(channel => {
      return getContentsPage(1).then(firstPage => {
        allContents.push(...firstPage.data)
        const totalPages = firstPage.meta.total_pages

        if (totalPages <= 1) {
          return Object.assign({}, channel, { contents: allContents })
        }

        return Array.from({ length: totalPages - 1 }, (_, i) => i + 2)
          .reduce(
            (promise, pageN) =>
              promise
                .then(() => getContentsPage(pageN))
                .then(page => allContents.push(...page.data)),
            Promise.resolve()
          )
          .then(() => {
            return Object.assign({}, channel, { contents: allContents })
          })
      })
    })
  }
}

export { tinyAPI }
