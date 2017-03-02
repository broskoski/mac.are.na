import React from 'react'
import { Link } from 'react-router'

class PlaylistLink extends React.Component {
  render () {
    const playlist = this.props.playlist
    const itemClass = "bb pv3 bg-animate"
    const selectedClass = (
      this.props.isSelected ?
      itemClass + ' bg-light-pink ' :
      itemClass + ' hover-bg-washed-red'
    )
    return (
      <div  className={selectedClass}>
        <Link className="list-item link dim black" to={`/playlist/${playlist.slug}`}>
          {playlist.user.full_name} / {playlist.title}
        </Link>
      </div>
    )
  }
}

export default PlaylistLink