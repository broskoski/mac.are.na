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

import { classifyItem } from './lib/helpers'
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
      indexOfCurrentTrack: 0,
      currentOpenPlaylist: null,
      currentTrackPlaylist: null,
      maxItemsInCurrentPage: 0,
      volume: 0.8,
      trackProgress: 0,
      trackDuration: 0,
    }
    this.API = new tinyAPI()
  }

  // get list of playlists and playlist list length
  componentWillMount() {
    const { activePage, per } = this.state
    const lengthPromise = this.API.getPlaylistChannelLength()
    const playlistListPromise = this.API.getPaginatedPlaylistList(activePage, per)
    Promise.all([lengthPromise, playlistListPromise])
      .then(([length, playlists]) => {
        this.setState({
          playlistListLength: length,
          playlists,
          maxItemsInCurrentPage: this.getMaxItemsInCurrentPage(length, this.state.per),
        })
      })
  }

  // i don't really get why this needs to happen, something to do with
  // specifically how pagination works
  // one issue right now is that the playlistListPromise returns # of all channels
  // including private channels
  getMaxItemsInCurrentPage = (length, per) => {
    return Math.ceil(length / this.state.per)
  }

  // if we go forward or back in pagination, update the playlist page
  // with new contents from an index in pagination
  handlePaginatedPageNav(event, selectedEvent) {
    const eventKey = selectedEvent.eventKey
    const { activePage, playlistListLength, per} = this.state
    const maxItemsInCurrentPage = this.getMaxItemsInCurrentPage(playlistListLength, per)
    this.setState({ maxItemsInCurrentPage })
    if(eventKey === 'next') {
      if(activePage !== maxItemsInCurrentPage) {
        return this.updatePlaylist(activePage + 1)
      } else {
        return this.updatePlaylist(maxItemsInCurrentPage)
      }
    }
    if(eventKey === 'prev') {
      if(activePage !== 1) {
        return this.updatePlaylist(activePage - 1)
      } else {
        return this.updatePlaylist(1)
      }
    }
    return this.updatePlaylist(eventKey)
  }

  // if we go to a new page, tell the app about the playlists on the new page
  updatePlaylist(page) {
    this.API.getPaginatedPlaylistList(page, this.state.per)
      .then(playlists => this.setState({ playlists, activePage: page }) )
  }

  // toggle function for playing and pausing with 1 element
  handlePlayback = () => {
    this.state.isPlaying ? this.pause() : this.play()
  }

  // currently any time a track is selected, it will be played.
  handleSongSelection = (item, indexOfCurrentTrack) => {
    let currentTrackURL = ''
    if (classifyItem(item) === 'mp3') {
      currentTrackURL = item.attachment.url
    } else {
      currentTrackURL = item.source.url
    }
    this.playlistToCurrentTrackPlaylist()
    this.setState({currentTrackURL, indexOfCurrentTrack})
    this.play()
  }

  // if we open a new playlist and play a track from it, make sure the app
  // knows about the new list
  playlistToCurrentTrackPlaylist = () => {
    this.setState({
      currentTrackPlaylist: this.state.currentOpenPlaylist
    })
  }

  // yep
  play = () => {
    this.setState({ isPlaying: true, })
  }
   // mhm
  pause = () => {
    this.setState({ isPlaying: false, })
  }

  // if we play a new track, tell the app about it's playlist
  setCurrentTrackPlaylist = (playlist) => {
    this.setState({ currentTrackPlaylist: playlist })
  }

  // if we select a playlist, get it's contents.
  // then, set it as the current open playlist
  returnSelectedPlaylist = (playlistSlug) => {
    this.API.getPaginatedPlaylistContents(playlistSlug)
      .then(playlist => {
        this.setState({ currentOpenPlaylist: playlist })
      })
  }

  // update +1 track and index
  goToNextTrack = () => {
    const { indexOfCurrentTrack, currentTrackPlaylist } = this.state
    if (indexOfCurrentTrack + 1 < currentTrackPlaylist.length) {
      const nextIndex = indexOfCurrentTrack + 1
      const nextTrack = currentTrackPlaylist[nextIndex]
      this.handleSongSelection(nextTrack, nextIndex)
    }
  }

  //  update -1 track and index
  goToPreviousTrack = () => {
    const { indexOfCurrentTrack, currentTrackPlaylist } = this.state
    if (indexOfCurrentTrack > 0) {
      const previousIndex = indexOfCurrentTrack - 1
      const previousTrack = currentTrackPlaylist[previousIndex]
      this.handleSongSelection(previousTrack, previousIndex)
    }
  }

  handleOnReady = (e) => {
    // console.log(e, 'ready')
  }

  handleOnStart = (e) => {
    // console.log(e, 'start')
  }

  handleOnPlay = (e) => {
    // console.log(e, 'play')
  }

  handleOnProgress = (e) => {
    // { loaded, loadedSeconds, played, playedSeconds }
    this.setState({ trackProgress: e.playedSeconds })
  }

  handleOnDuration = (e) => {
    this.setState({ trackDuration: e })
  }

  handleOnBuffer = (e) => {
    // console.log(e, 'buffering')
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
            goToNextTrack={this.goToNextTrack}
            goToPreviousTrack={this.goToPreviousTrack}
            currentTrackPlaylist={this.state.currentTrackPlaylist}
            volume={this.state.volume}
            handleOnReady={this.handleOnReady}
            handleOnStart={this.handleOnStart}
            handleOnPlay={this.handleOnPlay}
            handleOnProgress={this.handleOnProgress}
            handleOnDuration={this.handleOnDuration}
            handleOnBuffer={this.handleOnBuffer}
            trackProgress={this.state.trackProgress}
            trackDuration={this.state.trackDuration}
           />
          <Switch>
            <PropsRoute
              {...this.props}
              exact path={'/'}
              component={Playlists}
              listLength={this.state.maxItemsInCurrentPage}
              playlists={this.state.playlists}
              activePage={this.state.activePage}
              handlePlaylistSelect={this.handlePlaylistSelect}
              handlePaginatedPageNav={(event, selectedEvent) => this.handlePaginatedPageNav(event, selectedEvent)} />
            <PropsRoute
              path={'/playlist/:playlistSlug'}
              component={Playlist}
              currentOpenPlaylist={this.state.currentOpenPlaylist}
              handleSongSelection={this.handleSongSelection}
              returnSelectedPlaylist={this.returnSelectedPlaylist} />
          </Switch>
        </div>
      </Router>
    )
  }
}

// this takes props from <PropsRoute /> and passes them in a new
// object to the wrapped component
const renderMergedProps = (component, ...mePropsies) => {
  const finalProps = Object.assign({}, ...mePropsies)
  return (
    React.createElement(component, finalProps)
  )
}

// this component serves as a wrapper that allows props to be passed into routes
// this is why we can use one local state for most of the app
const PropsRoute = ({ component, ...mePropsies }) => {
  return (
    <Route {...mePropsies} render={routeProps => {
      return renderMergedProps(component, routeProps, mePropsies)
    }}/>
  )
}


export default Main
