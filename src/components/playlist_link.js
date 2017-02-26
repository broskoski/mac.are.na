import React from 'react'
import { Link } from 'react-router'

class PlaylistLink extends React.Component {
  render () {
    const playlist = this.props.playlist
    return (
      <div className="bb pv3">
        <Link className="list-item link dim black" to={`/playlist/${playlist.slug}`}>
          {playlist.user.full_name} / {playlist.title}
        </Link>
      </div>
    )
  }
}

export default PlaylistLink