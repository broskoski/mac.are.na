import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'

import Header from './components/Header'
import Playlists from './containers/Playlists'
import Playlist from './containers/Playlist'
import Player from './components/Player'
import Sortainer from './components/Sortainer'

import { tinyAPI } from './lib/api'
import {
  playerStates,
  sortKeys,
  sortChannelContents,
  immutablyChangeContents,
  validateWithMessage,
  incrementInList,
  decrementInList
} from './lib/helpers'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playlistListLength: 0,
      playlistChannel: null,
      isPlaying: false,
      currentOpenPlaylist: null,
      currentOpenPlaylistRejects: [],
      currentTrackPlaylist: null,
      currentTrack: null,
      volume: 0.8,
      trackProgress: 0,
      trackDuration: 0,
      isCurrentPlaylistLoaded: false,
      playerStatus: playerStates.idle,
      trackIsFromCurrentPlaylist: true,
      searchQuery: '',
      currentRoute: '/',
      playlistChannelSortObj: { orderKey: true, paramKey: sortKeys.position },
      playlistSortObj: { orderKey: true, paramKey: sortKeys.position },
      showRejects: false
    }
    this.API = new tinyAPI()
    this.playerRef = null
  }

  initializeCookies = () => {
    // FYI cookie returns string
    if (localStorage.getItem('isInverted') === 'true') {
      this.invert()
    } else {
      this.unInvert()
    }
  }

  // get list of playlists and playlist list length. also attach invert event
  componentWillMount() {
    this.initializeCookies()
    window.addEventListener('keydown', e => this.handleInvert(e))
    Promise.all([this.API.getBlockCount(), this.API.getChannelContents()]).then(
      ([length, playlistChannel]) => {
        this.setState({
          playlistListLength: length,
          playlistChannel: playlistChannel
        })
      }
    )
  }

  setQueryInState = event => {
    this.setState({ searchQuery: event.target.value })
  }

  // mhm
  handleInvert = e => {
    if (e.shiftKey && e.ctrlKey && e.code === 'KeyI') {
      if (document.body.classList.contains('invert')) {
        this.unInvert()
      } else {
        this.invert()
      }
    }
  }

  invert = () => {
    document.body.classList.add('invert')
    localStorage.setItem('isInverted', 'true')
  }

  unInvert = () => {
    document.body.classList.remove('invert')
    localStorage.setItem('isInverted', 'false')
  }

  // toggle function for playing and pausing with 1 UI element. Plays 1st track
  // of playlist if pressed and nothing has been played yet
  handlePlayback = () => {
    const {
      currentRoute,
      currentOpenPlaylist,
      isPlaying,
      currentTrack
    } = this.state
    if (currentRoute === '/playlist/:playlistSlug' && !currentTrack) {
      const item = currentOpenPlaylist.contents[0]
      this.handleSongUserSelection(item)
    } else if (currentRoute === '/playlist/:playlistSlug' || currentTrack) {
      isPlaying ? this.pause() : this.play()
    }
  }

  // change the currentTrack state.
  handleSongUserSelection = item => {
    this.setState({
      currentTrack: item,
      trackIsFromCurrentPlaylist: true,
      currentTrackPlaylist: this.state.currentOpenPlaylist
    })
    this.play()
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
    this.setState({ isPlaying: true })
  }

  pause = () => {
    this.setState({ isPlaying: false, playerStatus: playerStates.idle })
  }

  // if we select a playlist, get it's contents.
  // then, set it as the current open playlist
  setSelectedPlaylist = playlistSlug => {
    this.setState({ isCurrentPlaylistLoaded: false })
    this.API.getFullChannel(playlistSlug).then(playlist => {
      // validate it right off the bat
      const validatedContents = playlist.contents.map(item =>
        validateWithMessage(item)
      )
      const onlyValids = validatedContents.filter(
        item => item.macarenaURLValidity.isValid
      )
      const onlyRejects = validatedContents.filter(
        item => !item.macarenaURLValidity.isValid
      )
      const { currentTrackPlaylist } = this.state
      this.setState({
        currentOpenPlaylist: immutablyChangeContents(onlyValids, playlist),
        currentOpenPlaylistRejects: onlyRejects,
        isCurrentPlaylistLoaded: true,
        trackIsFromCurrentPlaylist: this.isTrackIsFromCurrentPlaylist(
          currentTrackPlaylist,
          playlist
        )
      })
    })
  }

  // update +1 track and index
  goToNextTrack = () => {
    const { currentTrackPlaylist, currentTrack } = this.state
    const trackList = currentTrackPlaylist.contents
    const indexOfCurrentTrack = trackList.findIndex(
      block => block.id === currentTrack.id
    )
    const nextItem = incrementInList(trackList, indexOfCurrentTrack)
    if (nextItem) {
      this.setState({ currentTrack: nextItem })
    } else {
      this.pause()
      this.setState({ currentTrackURL: false, currentTrack: false })
    }
  }

  //  update -1 track and index
  goToPreviousTrack = () => {
    const { currentTrackPlaylist, currentTrack } = this.state
    const trackList = currentTrackPlaylist.contents
    const indexOfCurrentTrack = trackList.findIndex(
      block => block.id === currentTrack.id
    )
    const previousItem = decrementInList(trackList, indexOfCurrentTrack)
    if (previousItem) {
      this.setState({ currentTrack: previousItem })
    } else {
      this.playerRef.seekTo(0)
    }
  }

  setCurrentRoute = currentRoute => {
    this.setState({ currentRoute })
  }

  handleOnReady = e => {
    // console.log(e, 'ready')
  }

  handleOnStart = e => {
    // console.log(e, 'start')
  }

  handleOnPlay = e => {
    this.setState({ playerStatus: playerStates.playing })
  }

  handleOnProgress = e => {
    this.setState({ trackProgress: e.playedSeconds })
  }

  handleOnDuration = e => {
    this.setState({ trackDuration: e })
  }

  handleOnBuffer = e => {
    this.setState({ playerStatus: playerStates.buffering })
  }

  handleOnError = event => {
    this.setState({ playerStatus: playerStates.errored })
    this.goToNextTrack()
  }

  returnRef = ref => {
    this.playerRef = ref
  }

  setSort = sortObj => {
    const { stateKey, orderKey, paramKey } = sortObj
    const { currentOpenPlaylist, playlistChannel } = this.state
    if (stateKey === 'playlistChannel') {
      const sortedList = sortChannelContents(playlistChannel.contents, sortObj)
      this.setState({
        playlistChannelSortObj: { orderKey, paramKey },
        playlistChannel: immutablyChangeContents(sortedList, playlistChannel)
      })
    } else if (stateKey === 'playlist') {
      const sortedList = sortChannelContents(
        currentOpenPlaylist.contents,
        sortObj
      )
      this.setState({
        playlistSortObj: { orderKey, paramKey },
        currentOpenPlaylist: immutablyChangeContents(
          sortedList,
          currentOpenPlaylist
        )
      })
    }
  }

  toggleShowRejects = () => {
    this.setState({ showRejects: !this.state.showRejects })
  }

  render() {
    return (
      <Router>
        <main>
          <HeaderWithRouter
            currentRoute={'/'}
            currentOpenPlaylist={this.state.currentOpenPlaylist}
            isCurrentPlaylistLoaded={this.state.isCurrentPlaylistLoaded}
          />
          <Player
            {...this.state}
            ref={this.ref}
            returnRef={this.returnRef}
            handlePlayback={this.handlePlayback}
            goToNextTrack={this.goToNextTrack}
            goToPreviousTrack={this.goToPreviousTrack}
            handleOnReady={this.handleOnReady}
            handleOnStart={this.handleOnStart}
            handleOnPlay={this.handleOnPlay}
            handleOnProgress={this.handleOnProgress}
            handleOnDuration={this.handleOnDuration}
            handleOnBuffer={this.handleOnBuffer}
            handleOnError={this.handleOnError}
          />
          <Sortainer
            {...this.state}
            setSort={this.setSort}
            setQueryInState={this.setQueryInState}
          />
          <Switch>
            <PropsRoute
              {...this.state}
              exact
              path={'/'}
              component={Playlists}
              handlePlaylistSelect={this.handlePlaylistSelect}
              setCurrentRoute={this.setCurrentRoute}
            />
            <PropsRoute
              {...this.state}
              path={'/playlist/:playlistSlug'}
              component={Playlist}
              handleSongUserSelection={this.handleSongUserSelection}
              setSelectedPlaylist={this.setSelectedPlaylist}
              setCurrentRoute={this.setCurrentRoute}
              toggleShowRejects={this.toggleShowRejects}
            />
          </Switch>
        </main>
      </Router>
    )
  }
}

// we need router info from <Router /> in header but header is not a route
const HeaderWithRouter = withRouter(props => <Header {...props} />)

// this takes props from <PropsRoute /> and passes them in a new
// object to the wrapped component
const renderMergedProps = (component, ...mePropsies) => {
  const finalProps = Object.assign({}, ...mePropsies)
  return React.createElement(component, finalProps)
}

// this component serves as a wrapper that allows props to be passed into routes
// this is why we can use one local state for most of the app
const PropsRoute = ({ component, ...mePropsies }) => {
  return (
    <Route
      key={mePropsies.location.key}
      {...mePropsies}
      render={routeProps => {
        return renderMergedProps(component, routeProps, mePropsies)
      }}
    />
  )
}

PropsRoute.propTypes = {
  component: PropTypes.any
}

export default Main
