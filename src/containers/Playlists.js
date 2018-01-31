import React, { Component } from 'react'
import { Pagination } from 'pui-react-pagination'
import { decode } from 'he'

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
    this.props.returnFullRoute(this.props.computedMatch.path)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.playlists){
      let playlists = []
      // we can make a sort by toggle here with the reversed prop eventually
      this.state.reversedOrder ? playlists = nextProps.playlists.reverse() : playlists = nextProps.playlists
      this.setState({playlists: playlists, initialPlaylists: playlists})
    }
  }

  filterList = (event) => {
    var updatedList = this.state.initialPlaylists;
    updatedList = updatedList.filter(function (item) {
      const text = `${decode(item.user.full_name)} / ${decode(item.title)}`
      return text.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ playlists: updatedList });
  }

  makePlaylistLinks = (playlists, handlePlaylistSelect) => {
    return playlists.map((playlist, index) => {
      const text = `${decode(playlist.user.full_name)} / ${decode(playlist.title)}`
      return (
        <LinkItem
          text={text}
          to={`/playlist/${playlist.slug}`}
          key={playlist.id}
          playlist={playlist}
          handleSelection={() => handlePlaylistSelect(playlist)}/>
        )
    })
  }

  render() {
    const {
      listLength,
      activePage,
      handlePaginatedPageNav,
      handlePlaylistSelect,
    } = this.props
    if (this.state.playlists) {
      return (
        <div>
          <div className="filterList">
            <form>
              <fieldset className="form-group">
                <input className="Input" type="text" placeholder="Search" onChange={this.filterList}>
                </input>
              </fieldset>
            </form>
          </div>
          { this.makePlaylistLinks(this.state.playlists, handlePlaylistSelect) }
        </div>
      )
    } else {
      return (
        <div id="loader-container" class="abs-fill">
          <div class="loader">
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" stroke-width="4" shape-rendering="crispEdges"></rect>
            </svg>
          </div>
        </div>
      )
    }
  }
}



export default Playlists
