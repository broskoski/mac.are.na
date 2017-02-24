import React from 'react'
import { Link } from 'react-router'

class Header extends React.Component {
  render() {
    return (
      <h1>
        <Link className="link dim black" to={`/`}>
          mac.are.na
        </Link>
      </h1>
    )
  }
}

export default Header