import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom'
import { Pagination } from 'pui-react-pagination'

import ListItemLink from './components/ListItemLink'
import Header from './components/Header'
import Home from './containers/Home'
import Playlist from './containers/Playlist'
import Player from './components/Player'

import { classifyItem } from './lib/classifier'
import { apiBase, playlistChannel } from './config'
import tinyAPI from './lib/api'

const base = apiBase[process.env.NODE_ENV]

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activePage: 1,
      playlists_length: 4,
      per: 20,
      playlists: [],
      isPlaying: false,
      currentTrackURL: null,
      currentOpenPlaylistID: null,
      currentTrackPlaylistSlug: null,
    }
  }

  componentWillMount() {
    const component = this
    fetch(`${base}/channels/${playlistChannel}/thumb`)
      .then(function(response) {
        return response.json();
      }).then(function(response) {
        const playlists_length = response.length;
        component.setState({ playlists_length });
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })

    fetch(`${base}/channels/${playlistChannel}/contents?page=${this.state.activePage}&per=${this.state.per}`)
      .then(function(response) {
        return response.json();
      }).then(function(response) {
        const playlists = response.contents;
        component.setState({ playlists });
      }).catch(function(ex) {
        console.error('parsing failed', ex);
      })
  }

  handleSelect(event, selectedEvent) {

    const eventKey = selectedEvent.eventKey;
    const activePage = this.state.activePage;
    const maxPage = Math.ceil(this.state.playlists_length / this.state.per);

    if(eventKey === 'next') {
      if(activePage !== maxPage) {
        return this.updatePlaylist(activePage + 1);
      } else {
        return this.updatePlaylist(maxPage);
      }
    }
    if(eventKey === 'prev') {
      if(activePage !== 1) {
        return this.updatePlaylist(activePage - 1);
      } else {
        return this.updatePlaylist(1);
      }
    }
    return this.updatePlaylist(selectedEvent.eventKey);
  }

  updatePlaylist(page) {
    const component = this
    fetch(`${base}/channels/${playlistChannel}/contents?page=${page}&per=${this.state.per}`)
      .then(function(response) {
        return response.json();
      }).then(function(response) {
        const playlists = response.contents;
        component.setState({
          playlists,
          activePage: page
        });
      }).catch(function(ex) {
        console.error('parsing failed', ex);
      })
  }

  handlePlayback = () => {
    this.state.isPlaying ? this.pause() : this.play()
  }

  play = () => {
    // more needs to happen here...
    this.setState({
      isPlaying: true,
    })
  }

  pause = () => {
    this.setState({ isPlaying: false })
  }

  setCurrentPlayingPlaylistSlug = (href) => {

  }

  handlePlaylistSelect = (id) => {
    this.setState({ currentOpenPlaylistID: id })
  }

  setCurrentTrackURL = (item) => {
    if (classifyItem(item) === 'mp3') {
      return item.attachment.url
    } else {
      return item.source.url
    }
  }

  makePlaylistLinks = (playlists) => {
    return playlists.map((playlist, index) => {
      return (
        <ListItemLink
          text={`${playlist.user.full_name} / ${decodeURIComponent(playlist.title)}`}
          to={`/playlist/${playlist.slug}`}
          key={playlist.id}
          playlist={playlist}
          handlePlaylistSelect={() => this.handlePlaylistSelect(playlist.id)}/>
        )
    })
  }

  render () {
    return (
      <Router>
        <div id={'w-100 min-vh-100 pa3 pa5-ns'}>
          <Header />
          <Player
            handlePlayback={this.handlePlayback}
            isPlaying={this.state.isPlaying}
            currentTrackURL={this.state.currentTrackURL}
            currentTrackPlaylistSlug={this.state.currentTrackPlaylistSlug} />
          <Switch>
            <PropsRoute exact path={'/'} component={Home} tinyAPI={tinyAPI} />
            <PropsRoute path={'/playlist/:playlistID'} component={Playlist} tinyAPI={tinyAPI} />
          </Switch>
        </div>
      </Router>
    )
  }
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return (
    React.createElement(component, finalProps)
  )
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest)
    }}/>
  )
}



// const List = ({listItems}) => {
//   return (
//     { this.makePlaylistLinks(this.state.playlists) }
//     <Pagination
//       items={Math.ceil(this.state.playlists_length / this.state.per)}
//       onSelect={(event, selectedEvent) => this.handleSelect(event, selectedEvent)}
//       activePage={this.state.activePage} />
//   )
// }

export default Main
