import React, { Component } from 'react'

import Playlists from './containers/Playlists'
import Playlist from './containers/Playlist'
import Player from './components/Player'

import { tinyAPI } from './lib/api'
import {
  playerStates,
  sortKeys,
  sortChannelContents,
  immutablyChangeContents,
  validateWithMessage,
  incrementInList,
  decrementInList,
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
      selectedPlaylistSlug: null,
      playlistChannelSortObj: { orderKey: true, paramKey: sortKeys.position },
      playlistSortObj: { orderKey: true, paramKey: sortKeys.position },
      showRejects: false,
    }
    this.API = new tinyAPI()
    this.playerRef = null
  }

  componentWillMount() {
    Promise.all([this.API.getBlockCount(), this.API.getChannelContents()]).then(
      ([length, playlistChannel]) => {
        this.setState({
          playlistListLength: length,
          playlistChannel: playlistChannel,
        })
      }
    )
  }

  setQueryInState = event => {
    this.setState({ searchQuery: event.target.value })
  }

  handlePlayback = () => {
    const { currentOpenPlaylist, isPlaying, currentTrack } = this.state
    if (currentOpenPlaylist && !currentTrack) {
      const item = currentOpenPlaylist.contents[0]
      this.handleSongUserSelection(item)
    } else if (currentTrack) {
      isPlaying ? this.pause() : this.play()
    }
  }

  handleSongUserSelection = item => {
    this.setState({
      currentTrack: item,
      trackIsFromCurrentPlaylist: true,
      currentTrackPlaylist: this.state.currentOpenPlaylist,
    })
    this.play()
  }

  isTrackIsFromCurrentPlaylist = (pl1, pl2) => {
    if (pl1 && pl2) {
      return pl1.id === pl2.id
    }
    return true
  }

  play = () => {
    this.setState({ isPlaying: true })
  }

  pause = () => {
    this.setState({ isPlaying: false, playerStatus: playerStates.idle })
  }

  selectPlaylist = playlistSlug => {
    this.setState({
      selectedPlaylistSlug: playlistSlug,
      isCurrentPlaylistLoaded: false,
    })
    this.API.getFullChannel(playlistSlug).then(playlist => {
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
        ),
      })
    })
  }

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
      this.setState({ currentTrack: false })
    }
  }

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

  handleOnReady = e => {}
  handleOnStart = e => {}

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
        playlistChannel: immutablyChangeContents(sortedList, playlistChannel),
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
        ),
      })
    }
  }

  toggleShowRejects = () => {
    this.setState({ showRejects: !this.state.showRejects })
  }

  render() {
    const {
      playlistChannel,
      currentOpenPlaylist,
      isCurrentPlaylistLoaded,
      selectedPlaylistSlug,
      searchQuery,
      playlistChannelSortObj,
      playlistSortObj,
    } = this.state

    const trackCount = currentOpenPlaylist
      ? currentOpenPlaylist.contents.length
      : 0

    return (
      <main>
        <div id="toolbar">
          <Player
            {...this.state}
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
        </div>
        <div id="content-area">
          <div id="source-list">
            <div id="source-list-header">
              <input
                className="source-search"
                value={searchQuery}
                type="text"
                placeholder="Search"
                onChange={this.setQueryInState}
              />
            </div>
            <div id="source-list-items">
              <Playlists
                playlistChannel={playlistChannel}
                searchQuery={searchQuery}
                playlistChannelSortObj={playlistChannelSortObj}
                selectedPlaylistSlug={selectedPlaylistSlug}
                selectPlaylist={this.selectPlaylist}
                setSort={this.setSort}
              />
            </div>
          </div>
          <div id="track-list">
            <Playlist
              currentOpenPlaylist={currentOpenPlaylist}
              isCurrentPlaylistLoaded={isCurrentPlaylistLoaded}
              currentOpenPlaylistRejects={this.state.currentOpenPlaylistRejects}
              handleSongUserSelection={this.handleSongUserSelection}
              currentTrack={this.state.currentTrack}
              trackIsFromCurrentPlaylist={this.state.trackIsFromCurrentPlaylist}
              toggleShowRejects={this.toggleShowRejects}
              showRejects={this.state.showRejects}
              selectedPlaylistSlug={selectedPlaylistSlug}
              playlistSortObj={playlistSortObj}
              setSort={this.setSort}
            />
          </div>
        </div>
        <div id="status-bar">
          {currentOpenPlaylist ? (
            <span>{trackCount} songs</span>
          ) : (
            <span>Select a playlist</span>
          )}
        </div>
      </main>
    )
  }
}

export default Main
