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
import Playlists from './containers/Playlists'
import Playlist from './containers/Playlist'
import Player from './components/Player'

import { classifyItem } from './lib/classifier'
import { apiBase, playlistChannel } from './config'
import { tinyAPI } from './lib/api'

const base = apiBase[process.env.NODE_ENV]

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activePage: 1,
      playlistListLength: 4,
      per: 20,
      playlists: [],
      isPlaying: false,
      currentTrackURL: null,
      currentOpenPlaylistID: null,
      currentTrackPlaylistSlug: null,
    }
    this.API = new tinyAPI()
  }

  componentWillMount() {
    const { activePage, per } = this.state
    const lengthPromise = this.API.getPlaylistChannelLength()
    const playlistListPromise = this.API.getPaginatedPlaylistList(activePage, per)
    Promise.all([lengthPromise, playlistListPromise])
      .then(([length, playlists]) => {
        this.setState({
          playlistListLength: length,
          playlists,
        })
      })
  }

  handleSelect(event, selectedEvent) {
    const eventKey = selectedEvent.eventKey;
    const activePage = this.state.activePage;
    const maxPage = Math.ceil(this.state.playlistListLength / this.state.per);

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

  render () {
    const listLength = Math.ceil(this.state.playlistListLength / this.state.per)
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
            <PropsRoute
              exact path={'/'}
              component={Playlists}
              tinyAPI={tinyAPI}
              listLength={listLength}
              playlists={this.state.playlists}
              activePage={this.state.activePage} />
            <PropsRoute
              path={'/playlist/:playlistID'}
              component={Playlist}
              tinyAPI={tinyAPI} />
          </Switch>
        </div>
      </Router>
    )
  }
}

// all this does is take props from <PropsRoute /> and passes them in a new
// object to the wrapped component
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return (
    React.createElement(component, finalProps)
  )
}

// this component serves as a wrapper that allows props to be passed into routes
// this is why we can use one local state for most of the app
const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest)
    }}/>
  )
}


export default Main
