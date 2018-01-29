import React from 'react'
import { find, findIndex } from 'lodash'
import { apiBase } from '../config'
import { onlySongs } from '../lib/filter'

import SongItem from '../components/SongItem'

const base = apiBase[process.env.NODE_ENV]

class Playlist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      playlistID: null,
      selectedID: null
    }
  }

  getPlaylistLink(response) {
    return `https://www.are.na/${response.user.slug}/${response.slug}`
  }

  componentDidMount() {
    // get slug from router params and return it to <Main />
    const playlistSlug = this.props.match.params.playlistSlug
    console.log(playlistSlug)
    this.props.returnSelectedPlaylist(playlistSlug)
  }

  playNext() {
    const selectedItemIndex = findIndex(this.state.items, (item) => {
      return item.id === this.state.selectedID
    })
    const newItemIndex = (
      selectedItemIndex + 1 > this.state.items.length ?
      0 :
      selectedItemIndex + 1
    )
    const newItem = this.state.items[newItemIndex]
    this.setState({
      selectedID: newItem.id
    })
  }

  makeSongList = (playlist) => {
    if (playlist) {
      return playlist.map((song, index) => {
        return (
          <SongItem
            key={song.id}
            song={song}
            handleSelection={() => this.props.handleSongSelection(song, index)} />
        )
      })
    }
  }

  render () {
    return (
      <div className='w-100 min-vh-100 pa3 pa5-ns'>
        {this.makeSongList(this.props.currentOpenPlaylist)}
      </div>
    )
  }
}

export default Playlist
