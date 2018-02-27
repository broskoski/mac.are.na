import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LoadState from '../components/LoadState'
import ToggleRejectedSongs from '../components/ToggleRejectedSongs'
import { SongItem, SongItemReject } from '../components/SongItem'

class Channel extends Component {
  componentDidMount() {
    // get slug from router params and return it to <Main />
    const {
      match,
      setSelectedChannel,
      setCurrentRoute,
      computedMatch
    } = this.props

    const channelSlug = match.params.channelSlug
    setSelectedChannel(channelSlug)
    setCurrentRoute(computedMatch.path)
  }

  makeSongList = validItems => {
    const { handleBlockUserSelection } = this.props

    return validItems.map((block, index) => {
      return (
        <SongItem
          key={block.id}
          block={block}
          isSelected={this.handleIsSelected(block)}
          handleSelection={() => handleBlockUserSelection(block)}
        />
      )
    })
  }

  handleIsSelected = block => {
    const { blockIsFromCurrentChannel, currentTrack } = this.props
    if (currentTrack) {
      if (currentTrack.id === block.id && blockIsFromCurrentChannel) {
        return true
      }
    }
    return false
  }

  makeSongRejectList = rejects => {
    return rejects.map(block => {
      return <SongItemReject key={block.id} block={block} />
    })
  }

  render() {
    const {
      currentOpenChannel,
      isCurrentChannelLoaded,
      handleChannelSelect,
      currentOpenChannelRejects,
      toggleShowRejects,
      showRejects
    } = this.props

    if (isCurrentChannelLoaded && currentOpenChannel) {
      const renderList = this.makeSongList(
        currentOpenChannel.contents,
        handleChannelSelect
      )
      const rejectCount = currentOpenChannelRejects.length
      return (
        <div className="w-100 min-vh-100">
          {renderList}
          {showRejects ? (
            this.makeSongRejectList(currentOpenChannelRejects)
          ) : (
            <div />
          )}
          {rejectCount > 0 ? (
            <ToggleRejectedSongs
              toggleShowRejects={toggleShowRejects}
              rejectCount={rejectCount}
              showRejects={showRejects}
            />
          ) : (
            <div />
          )}
        </div>
      )
    } else {
      return <LoadState />
    }
  }
}

Channel.propTypes = {
  match: PropTypes.any,
  setSelectedChannel: PropTypes.func,
  setCurrentRoute: PropTypes.func,
  computedMatch: PropTypes.any,
  handleBlockUserSelection: PropTypes.func,
  currentTrack: PropTypes.any,
  blockIsFromCurrentChannel: PropTypes.bool,
  currentOpenChannel: PropTypes.any,
  isCurrentChannelLoaded: PropTypes.bool,
  handleChannelSelect: PropTypes.func,
  currentOpenChannelRejects: PropTypes.any,
  toggleShowRejects: PropTypes.func,
  showRejects: PropTypes.bool
}

export default Channel
