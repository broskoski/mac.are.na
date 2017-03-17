import React from 'react'
import { Link } from 'react-router'
import { unescape } from 'lodash'

class PlaylistLink extends React.Component {
  render () {
    const playlist = this.props.playlist
    const itemClass = "bb pv3 bg-animate"
    const selectedClass = (
      this.props.isSelected ?
      itemClass + ' bg-light-pink ' :
      itemClass + ' hover-bg-washed-red'
    )
    console.log('unescape(playlist.title)', unescape(playlist.title))
    return (
      <div  className={selectedClass}>
        <Link 
          className="list-item link dim black" 
          to={`/playlist/${playlist.slug}`}
        >
          {playlist.user.full_name} / {unescape(playlist.title)}
        </Link>
      </div>
    )
  }
}

export default PlaylistLink