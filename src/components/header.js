import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { decode } from 'he'

class Header extends Component {
  handleHeaderText = () => {
    const { currentOpenPlaylist } = this.props
    if (currentOpenPlaylist) {
      if (this.props.location.pathname !== '/') {
        return decode(` / ${currentOpenPlaylist.title}`)
      }
      return ''
    }
    return ''
  }

  render() {
    return (
      <header>
        <h1>
          <a href="https://www.are.na/mac-are-na/" target="_blank">
            <img className="logo dim black" src={logo} alt="logo" />
          </a>
          <Link className="link dim black" to={`/`}>
            {'mac.are.na'}
          </Link>
          { this.handleHeaderText() }
        </h1>
      </header>
    )
  }
}

export default Header
