import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { decode } from 'he'
import { getStatus } from '../lib/helpers'
import arrow from '../assets/arrow.svg'

class Header extends Component {
  handleHeaderText = () => {
    const { currentOpenPlaylist, isCurrentPlaylistLoaded } = this.props
    if (currentOpenPlaylist && isCurrentPlaylistLoaded) {
      if (this.props.location.pathname !== '/') {
        const playlistTitle = decode(`/ ${currentOpenPlaylist.title}`)
        const status = getStatus(currentOpenPlaylist)
        return <div style={{marginLeft:'1rem'}} className={`inlineBlock ${status}`}>{playlistTitle}</div>
      }
      return ''
    }
    return ''
  }

  handleToArena = () => {
    const { currentOpenPlaylist, isCurrentPlaylistLoaded } = this.props
    if (currentOpenPlaylist && isCurrentPlaylistLoaded && this.props.location.pathname !== '/') {
      return (
        <a className={'toArena'} target={'_blank'} href={`https://www.are.na/${currentOpenPlaylist.user.slug}/${currentOpenPlaylist.slug}`}>
          <img alt={'Find on are.na'} src={arrow} />
        </a>
      )
    }
    return (
      <a className={'toArena'} target={'_blank'} href={`https://www.are.na/charles-broskoski/mac-are-na`}>
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
          { this.handleHeaderText() }
        </h1>
        { this.handleToArena() }
      </header>
    )
  }
}

export default Header
