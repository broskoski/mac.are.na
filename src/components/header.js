import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { decode } from 'he'

const Header = ({ currentOpenPlaylist }) => {
  const playlistTitle = currentOpenPlaylist ? ` / ${currentOpenPlaylist.title}` : ''
  return (
    <header>
      <h1>
        <a href="https://www.are.na/mac-are-na/" target="_blank">
          <img className="logo dim black" src={logo} alt="logo" />
        </a>
        <Link className="link dim black" to={`/`}>
          {'mac.are.na'}
        </Link>
        { decode(playlistTitle) }
      </h1>
    </header>
  )
}

export default Header
