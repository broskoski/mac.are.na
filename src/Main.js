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

import { playlistChannel } from './config'
import { TinyAPI } from './lib/api'
import { Validator } from './lib/validator'
import { playerStates } from './lib/keys'
import { updateInObject, incrementInList, decrementInList } from './lib/core'
import { sortChannelContents, sortKeys } from './lib/sort'
import validatorConfig from './lib/validatorConfig'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playlistListLength: 0,
      playlistChannel: null,
      isPlaying: false,
      currentOpenChannel: null,
      currentOpenChannelRejects: [],
      channelOfCurrentBlock: null,
      blockOnDeck: null,
      volume: 0.8,
      trackProgress: 0,
      trackDuration: 0,
      isCurrentChannelLoaded: false,
      playerStatus: playerStates.idle,
      blockIsFromCurrentChannel: true,
      searchQuery: '',
      currentRoute: '/',
      playlistChannelSortObj: { orderKey: true, paramKey: sortKeys.position },
      playlistSortObj: { orderKey: true, paramKey: sortKeys.position },
      showRejects: false
    }
    this.API = new TinyAPI()
    this.validator = new Validator(validatorConfig)
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
    Promise.all([this.API.getBlockCount(playlistChannel), this.API.getChannelContents(playlistChannel)]).then(
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
      currentOpenChannel,
      isPlaying,
      blockOnDeck
    } = this.state
    if (currentRoute === '/playlist/:channelSlug' && !blockOnDeck) {
      const firstBlock = currentOpenChannel.contents[0]
      this.handleBlockUserSelection(firstBlock, false)
    } else if (currentRoute === '/playlist/:channelSlug' || blockOnDeck) {
      isPlaying ? this.pause() : this.play()
    }
  }

  // change the blockOnDeck state.
  handleBlockUserSelection = block => {
    this.setState({
      blockOnDeck: block,
      blockIsFromCurrentChannel: true,
      channelOfCurrentBlock: this.state.currentOpenChannel
    })
    this.play()
  }

  // determines if the currently playing/paused track is from the currently
  // displayed playlist
  isBlockIsFromCurrentChannel = (channelA, channelB) => {
    if (channelA && channelB) {
      return channelA.id === channelB.id ? true : false
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
  setSelectedChannel = channelSlug => {
    this.setState({ isCurrentChannelLoaded: false })
    this.API.getFullChannel(channelSlug).then(channel => {
      // validate it right off the bat
      const validatedContents = channel.contents.map(block =>
        this.validator.validate(block)
      )
      const onlyValids = validatedContents.filter(
        block => block.validity.isValid
      )
      const onlyRejects = validatedContents.filter(
        block => !block.validity.isValid
      )
      const { channelOfCurrentBlock } = this.state
      this.setState({
        currentOpenChannel: updateInObject(channel, 'contents', onlyValids),
        currentOpenChannelRejects: onlyRejects,
        isCurrentChannelLoaded: true,
        blockIsFromCurrentChannel: this.isBlockIsFromCurrentChannel(
          channelOfCurrentBlock,
          channel
        )
      })
    })
  }

  // update +1 track and index
  goToNextBlock = () => {
    const { channelOfCurrentBlock, blockOnDeck } = this.state
    const trackList = channelOfCurrentBlock.contents
    const indexOfCurrentBlock = trackList.findIndex(
      block => block.id === blockOnDeck.id
    )
    const nextItem = incrementInList(trackList, indexOfCurrentBlock)
    if (nextItem) {
      this.setState({ blockOnDeck: nextItem })
    } else {
      this.pause()
      this.setState({ blockOnDeckURL: false, blockOnDeck: false })
    }
  }

  //  update -1 track and index
  goToPreviousBlock = () => {
    const { channelOfCurrentBlock, blockOnDeck } = this.state
    const trackList = channelOfCurrentBlock.contents
    const indexOfCurrentBlock = trackList.findIndex(
      block => block.id === blockOnDeck.id
    )
    const previousItem = decrementInList(trackList, indexOfCurrentBlock)
    if (previousItem) {
      this.setState({ blockOnDeck: previousItem })
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
    this.goToNextBlock()
  }

  returnRef = ref => {
    this.playerRef = ref
  }

  setSort = sortObj => {
    const { stateKey, orderKey, paramKey } = sortObj
    const { currentOpenChannel, playlistChannel } = this.state
    if (stateKey === 'playlistChannel') {
      const sortedList = sortChannelContents(playlistChannel.contents, sortObj)
      this.setState({
        playlistChannelSortObj: { orderKey, paramKey },
        playlistChannel: updateInObject(sortedList, 'contents', playlistChannel)
      })
    } else if (stateKey === 'playlist') {
      const sortedList = sortChannelContents(
        currentOpenChannel.contents,
        sortObj
      )
      this.setState({
        playlistSortObj: { orderKey, paramKey },
        currentOpenChannel: updateInObject(
          sortedList,
          'contents',
          currentOpenChannel
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
            currentOpenChannel={this.state.currentOpenChannel}
            isCurrentChannelLoaded={this.state.isCurrentChannelLoaded}
          />
          <Player
            {...this.state}
            ref={this.ref}
            returnRef={this.returnRef}
            handlePlayback={this.handlePlayback}
            goToNextBlock={this.goToNextBlock}
            goToPreviousBlock={this.goToPreviousBlock}
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
              handleChannelSelect={this.handleChannelSelect}
              setCurrentRoute={this.setCurrentRoute}
            />
            <PropsRoute
              {...this.state}
              path={'/playlist/:channelSlug'}
              component={Playlist}
              handleBlockUserSelection={this.handleBlockUserSelection}
              setSelectedChannel={this.setSelectedChannel}
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
