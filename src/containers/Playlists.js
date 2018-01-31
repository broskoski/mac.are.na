import React, { Component } from 'react'
import { Pagination } from 'pui-react-pagination'
import { decode } from 'he'
import { getStatus } from '../lib/helpers'

import LinkItem from '../components/LinkItem'

class Playlists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playlists: [],
      initialPlaylists: [],
      reversedOrder: true,
    }
  }

  componentDidMount() {
    // make app aware of current route
    this.props.returnFullRoute(this.props.computedMatch.path)
  }

  makePlaylistLinks = (playlists, handlePlaylistSelect) => {
    return playlists.map((playlist, index) => {
      const text = decode(`${playlist.user.full_name} / ${playlist.title}`)
      return (
        <LinkItem
          text={text}
          status={getStatus(playlist)}
          to={`/playlist/${playlist.slug}`}
          key={playlist.id}
          playlist={playlist}
          handleSelection={() => handlePlaylistSelect(playlist)}/>
        )
    })
  }

  filterByQuery = (list, predicate) => {
    return list.filter((playlist, index) => {
      const text = decode(`${playlist.user.full_name} / ${playlist.title}`)
      const match = text.toLowerCase().indexOf(predicate.toLowerCase()) > -1
      return match
    })
  }

  render() {
    const {
      listLength,
      activePage,
      handlePaginatedPageNav,
      handlePlaylistSelect,
      playlistChannel,
      setQueryInState,
      searchQuery,
    } = this.props
    if (playlistChannel) {
      let renderList = []

      if (searchQuery !== '') {
        const filteredPlaylistContents = this.filterByQuery(playlistChannel.contents, searchQuery)
        renderList = this.makePlaylistLinks(filteredPlaylistContents, handlePlaylistSelect)
      } else {
        renderList = this.makePlaylistLinks(playlistChannel.contents, handlePlaylistSelect)
      }
      return (
        <div>
          <div className="filterList">
            <form>
              <fieldset className="form-group">
                <input value={searchQuery}
                  className={'Input'}
                  type={'text'}
                  placeholder={'Search Channels'}
                  onChange={(e) => setQueryInState(e)} />
              </fieldset>
            </form>
          </div>
          { renderList }
        </div>
      )
    } else {
      return (
        <div id="loader-container" className="abs-fill">
          <div className="loader">
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" strokeWidth="4" shapeRendering="crispEdges"></rect>
            </svg>
          </div>
        </div>
      )
    }
  }
}



export default Playlists
