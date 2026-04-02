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
      showInfoModal: false,
      viewMode: 'list',
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
        const match = window.location.pathname.match(/^\/playlist\/(.+)$/)
        if (match) {
          this.selectPlaylist(match[1])
        }
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
    window.history.pushState(null, '', '/playlist/' + playlistSlug)
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

  toggleInfoModal = () => {
    this.setState({ showInfoModal: !this.state.showInfoModal })
  }

  toggleViewMode = () => {
    this.setState({
      viewMode: this.state.viewMode === 'list' ? 'album' : 'list',
    })
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

    const currentTrack = this.state.currentTrack
    const albumArt =
      currentTrack && currentTrack.image && currentTrack.image.square
        ? currentTrack.image.square.src
        : null

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
            {albumArt && (
              <div id="album-art-panel">
                <img src={albumArt} alt="Now playing" />
              </div>
            )}
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
              viewMode={this.state.viewMode}
            />
          </div>
        </div>
        <div id="status-bar">
          <div id="status-left">
            <button
              className="status-btn"
              onClick={this.toggleInfoModal}
              title="About mac.are.na"
            >
              <svg viewBox="0 0 16 16" width="11" height="11">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <text
                  x="8"
                  y="12"
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  i
                </text>
              </svg>
            </button>
          </div>
          <div id="status-center">
            {currentOpenPlaylist ? (
              <span>{trackCount} songs</span>
            ) : (
              <span>Select a playlist</span>
            )}
          </div>
          <div id="status-right">
            <button
              className={`status-btn view-toggle ${
                this.state.viewMode === 'list' ? 'active' : ''
              }`}
              onClick={
                this.state.viewMode !== 'list' ? this.toggleViewMode : undefined
              }
              title="List view"
            >
              <svg viewBox="0 0 16 16" width="11" height="11">
                <rect x="1" y="2" width="14" height="2" fill="currentColor" />
                <rect x="1" y="7" width="14" height="2" fill="currentColor" />
                <rect x="1" y="12" width="14" height="2" fill="currentColor" />
              </svg>
            </button>
            <button
              className={`status-btn view-toggle ${
                this.state.viewMode === 'album' ? 'active' : ''
              }`}
              onClick={
                this.state.viewMode !== 'album'
                  ? this.toggleViewMode
                  : undefined
              }
              title="Album view"
            >
              <svg viewBox="0 0 16 16" width="11" height="11">
                <rect x="1" y="1" width="6" height="6" fill="currentColor" />
                <rect x="9" y="1" width="6" height="6" fill="currentColor" />
                <rect x="1" y="9" width="6" height="6" fill="currentColor" />
                <rect x="9" y="9" width="6" height="6" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        {this.state.showInfoModal && (
          <div className="modal-overlay" onClick={this.toggleInfoModal}>
            <div className="modal-window" onClick={e => e.stopPropagation()}>
              <div className="modal-titlebar">
                <span>About mac.are.na</span>
                <button className="modal-close" onClick={this.toggleInfoModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>mac.are.na</strong> is a music player that reads from{' '}
                  <a
                    href="https://www.are.na/charles-broskoski/mac-are-na"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Are.na
                  </a>{' '}
                  channels.
                </p>
                <p>
                  Add a channel containing playable media (YouTube, SoundCloud,
                  MP3s, etc.) to the{' '}
                  <a
                    href="https://www.are.na/charles-broskoski/mac-are-na"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    mac.are.na
                  </a>{' '}
                  channel and it will appear as a playlist.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    )
  }
}

export default Main
