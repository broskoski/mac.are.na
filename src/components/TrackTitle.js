import React from 'react'
import PropTypes from 'prop-types'
import { decode } from 'he'
import { Link } from 'react-router-dom'

const TrackTitle = ({
  trackInfo,
  currentTrackPlaylist,
  trackIsFromCurrentPlaylist,
  currentRoute
}) => {
  if (trackInfo) {
    const title = decode(trackInfo.title)
    if (!trackIsFromCurrentPlaylist || currentRoute === '/') {
      const playlistSlug = currentTrackPlaylist.slug
      const playListTitle = decode(currentTrackPlaylist.title)
      return (
        <div className={'tile-wrap-full'}>
          <p>
            {title}
            <Link to={`/playlist/${playlistSlug}`}>
              {`from ${playListTitle}`}
            </Link>
          </p>
        </div>
      )
    }

    return (
      <div className={'tile-wrap-full'}>
        <p>{title}</p>
      </div>
    )
  }

  return (
    <div className={'tile-wrap-full'}>
      <p>{':~)'}</p>
    </div>
  )
}

TrackTitle.propTypes = {
  trackInfo: PropTypes.any,
  currentTrackPlaylist: PropTypes.any,
  trackIsFromCurrentPlaylist: PropTypes.bool,
  currentRoute: PropTypes.string
}

export default TrackTitle
