import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import logo from '../assets/logo.svg'
import { decode } from 'he'
import { getStatus } from '../lib/core'
import arrow from '../assets/arrow.svg'

class Header extends Component {
  handleHeaderText = () => {
    const { currentOpenChannel, isCurrentChannelLoaded } = this.props

    if (currentOpenChannel && isCurrentChannelLoaded) {
      if (this.props.location.pathname !== '/') {
        const playlistTitle = decode(`/ ${currentOpenChannel.title}`)
        const status = getStatus(currentOpenChannel)
        return (
          <div
            style={{ marginLeft: '1rem' }}
            className={`inlineBlock ${status}`}
          >
            {playlistTitle}
          </div>
        )
      }
      return ''
    }
    return ''
  }

  handleToArena = () => {
    const { currentOpenChannel, isCurrentChannelLoaded } = this.props

    if (
      currentOpenChannel &&
      isCurrentChannelLoaded &&
      this.props.location.pathname !== '/'
    ) {
      return (
        <a
          className={'toArena'}
          target={'_blank'}
          href={`https://www.are.na/${currentOpenChannel.user.slug}/${
            currentOpenChannel.slug
          }`}
        >
          <img alt={'Find on are.na'} src={arrow} />
        </a>
      )
    }
    return (
      <a
        className={'toArena'}
        target={'_blank'}
        href={`https://www.are.na/charles-broskoski/mac-are-na`}
      >
        <img alt={'Find on are.na'} src={arrow} />
      </a>
    )
  }

  render() {
    return (
      <header>
        <h1>
          <Link to={`/`}>
            <img className="logo" src={logo} alt="logo" />
            {'mac.are.na'}
          </Link>
          {this.handleHeaderText()}
        </h1>
        {this.handleToArena()}
      </header>
    )
  }
}

Header.propTypes = {
  currentOpenChannel: PropTypes.any,
  isCurrentChannelLoaded: PropTypes.bool,
  location: PropTypes.any
}

export default Header
