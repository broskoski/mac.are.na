import React from 'react'
import PropTypes from 'prop-types'
import { decode } from 'he'
import { Link } from 'react-router-dom'

const TrackTitle = ({
  block,
  playlistOfCurrentBlock,
  blockIsFromCurrentPlaylist,
  currentRoute
}) => {
  if (block) {
    const title = decode(block.title)
    if (!blockIsFromCurrentPlaylist || currentRoute === '/') {
      const playlistSlug = playlistOfCurrentBlock.slug
      const playListTitle = decode(playlistOfCurrentBlock.title)
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
  block: PropTypes.any,
  playlistOfCurrentBlock: PropTypes.any,
  blockIsFromCurrentPlaylist: PropTypes.bool,
  currentRoute: PropTypes.string
}

export default TrackTitle
