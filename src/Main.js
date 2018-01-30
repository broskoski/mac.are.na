import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter,
} from 'react-router-dom'
import { Pagination } from 'pui-react-pagination'

import LinkItem from './components/LinkItem'
import Header from './components/Header'
import Playlists from './containers/Playlists'
import Playlist from './containers/Playlist'
import Player from './components/Player'

import { classifyItem, makeHash } from './lib/helpers'
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
      playlists: null,
      isPlaying: false,
      currentTrackURL: null,
      indexOfCurrentTrack: 0,
      currentOpenPlaylist: null,
      currentTrackPlaylist: null,
      maxItemsInCurrentPage: 0,
      volume: 0.8,
      trackProgress: 0,
      trackDuration: 0,
      isCurrentPlaylistLoaded: false,
    }
    this.API = new tinyAPI()
  }

  // get list of playlists and playlist list length. also attach invert event
  componentWillMount() {
    window.addEventListener('keydown', (e) => this.handleInvert(e))

    const { activePage, per } = this.state

    Promise.all([
      this.API.getBlockCount(),
      this.API.getPaginatedChannelContents(activePage, per),
    ])
      .then(([length, playlists]) => {
        this.setState({
          playlistListLength: length,
          playlists,
          maxItemsInCurrentPage: this.getMaxItemsInCurrentPage(length, this.state.per),
        })
      })
  }

  // mhm
  handleInvert = (e) => {
    if (e.shiftKey && e.ctrlKey && e.code === 'KeyI') {
      document.body.classList.toggle('invert')
    }
  }

  // i don't really get why this needs to happen, something to do with
  // specifically how pagination works
  // one issue right now is that the playlistListPromise returns # of all channels
  // including private channels ( i think )
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
    if (eventKey === 'next') {
      if (activePage !== maxItemsInCurrentPage) {
        return this.updatePlaylist(activePage + 1)
      } else {
        return this.updatePlaylist(maxItemsInCurrentPage)
      }
    }
    if (eventKey === 'prev') {
      if (activePage !== 1) {
        return this.updatePlaylist(activePage - 1)
      } else {
        return this.updatePlaylist(1)
      }
    }
    return this.updatePlaylist(eventKey)
  }

  // if we go to a new page, tell the app about the playlists on the new page
  updatePlaylist(page) {
    this.API.getPaginatedChannelContents(page, this.state.per)
      .then(playlists => this.setState({ playlists, activePage: page }) )
  }

  // toggle function for playing and pausing with 1 element
  handlePlayback = () => {
    this.state.isPlaying ? this.pause() : this.play()
  }

  // currently any time a track is selected, it will be played.
  handleSongSelection = (item, indexOfCurrentTrack) => {
    const { currentOpenPlaylist, currentTrackPlaylist } = this.state

    this.setState({
      currentTrackURL: this.returnBlockURL(item),
      indexOfCurrentTrack,
      currentTrackInfo: item,
      trackIsFromCurrentPlaylist: true,
      currentTrackPlaylist: this.state.currentOpenPlaylist
    })

    this.play()
  }


  // different blocks have diff ways of storing src
  returnBlockURL = (item) => {
    if (classifyItem(item) === 'mp3') {
      return item.attachment.url
    } else {
      return item.source.url
    }
  }

  // determines if the currently playing/paused track is from the currently
  // displayed playlist
  isTrackIsFromCurrentPlaylist = (pl1, pl2) => {
    if (pl1 && pl2) {
      return pl1.id === pl2.id ? true : false
    } else {
      return true
    }
  }


  play = () => {
    this.setState({ isPlaying: true, })
  }

  pause = () => {
    this.setState({ isPlaying: false, })
  }

  // if we select a playlist, get it's contents.
  // then, set it as the current open playlist
  returnSelectedPlaylist = (playlistSlug) => {
    this.setState({isCurrentPlaylistLoaded: false})
    this.API.getFullChannel(playlistSlug)
      .then(playlist => {
        const { currentTrackPlaylist } = this.state
        this.setState({
          currentOpenPlaylist: playlist,
          isCurrentPlaylistLoaded: true,
          trackIsFromCurrentPlaylist: this.isTrackIsFromCurrentPlaylist(currentTrackPlaylist, playlist)
        })
      })
  }

  // update +1 track and index
  goToNextTrack = () => {
    const { indexOfCurrentTrack, currentTrackPlaylist } = this.state
    if (indexOfCurrentTrack + 1 < currentTrackPlaylist.length) {
      const nextIndex = indexOfCurrentTrack + 1
      const nextTrack = currentTrackPlaylist.contents[nextIndex]
      this.handleSongSelection(nextTrack, nextIndex)
    }
  }

  //  update -1 track and index
  goToPreviousTrack = () => {
    const { indexOfCurrentTrack, currentTrackPlaylist } = this.state
    if (indexOfCurrentTrack > 0) {
      const previousIndex = indexOfCurrentTrack - 1
      const previousTrack = currentTrackPlaylist.contents[previousIndex]
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
        <div className={'w-100 min-vh-100 pa3 pa5-ns'}>
          <HeaderWithRouter
            currentRoute={'/'}
            currentOpenPlaylist={this.state.currentOpenPlaylist} />
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
            currentTrackInfo={this.state.currentTrackInfo}
            currentTrackPlaylist={this.state.currentTrackPlaylist}
            trackIsFromCurrentPlaylist={this.state.trackIsFromCurrentPlaylist}
           />
          <Switch>
            <PropsRoute
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
              isCurrentPlaylistLoaded={this.state.isCurrentPlaylistLoaded}
              currentOpenPlaylist={this.state.currentOpenPlaylist}
              handleSongSelection={this.handleSongSelection}
              returnSelectedPlaylist={this.returnSelectedPlaylist} />
          </Switch>
        </div>
      </Router>
    )
  }
}

// we need router info from <Router /> in header but header is not a route
const HeaderWithRouter = withRouter(props => <Header {...props}/>)

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
    <Route key={mePropsies.location.key} {...mePropsies} render={routeProps => {
      return renderMergedProps(component, routeProps, mePropsies)
    }}/>
  )
}


export default Main
