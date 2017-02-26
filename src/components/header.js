import React from 'react'
import { Link } from 'react-router'

class Header extends React.Component {
  render() {
    return (
      <h1>
        <a href="https://are.na/mac-are-na/" target="_blank">
          <img className="logo dim black" src={require('../assets/logo.svg')} alt="logo" />
        </a>
        <Link className="link dim black" to={`/`}>
          mac.are.na
        </Link>
      </h1>
    )
  }
}

export default Header