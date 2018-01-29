import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

// class Header extends React.Component {
//   render() {
//     const { pathTitle, pathUrl } = this.props
//     return (
//       <h1>
//         <a href="https://www.are.na/mac-are-na/" target="_blank">
//           <img className="logo dim black" src={logo} alt="logo" />
//         </a>
//         <Link className="link dim black" to={`/`}>
//           mac.are.na
//         </Link>
//         { pathTitle &&
//           <a className="link dim black" href={pathUrl} target="_blank">
//             &nbsp;/ {pathTitle}
//           </a>
//         }
//       </h1>
//     )
//   }
// }

const Header = ({ currentOpenPlaylist }) => {
  const playlistTitle = currentOpenPlaylist ? ` / ${currentOpenPlaylist.title}` : null
  return (
    <header>
      <h1>
        <a href="https://www.are.na/mac-are-na/" target="_blank">
          <img className="logo dim black" src={logo} alt="logo" />
        </a>
        <Link className="link dim black" to={`/`}>
          mac.are.na
        </Link>
        { playlistTitle }
      </h1>
    </header>
  )
}

export default Header
