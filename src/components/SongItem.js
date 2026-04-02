import React from 'react'
import PropTypes from 'prop-types'
import { decode } from 'he'
import { scrubTitle } from '../lib/helpers'

const SongItem = ({ isSelected, handleSelection, song, index }) => {
  const title = scrubTitle(song.title)
  return (
    <div
      className={`track-row ${isSelected ? 'track-selected' : ''}`}
      onClick={handleSelection}
      onDoubleClick={handleSelection}
    >
      <div className="col col-num">{isSelected ? '\u25B6' : index}</div>
      <div className="col col-name">{decode(title)}</div>
      <div className="col col-position">
        {song.connection ? song.connection.position : song.position}
      </div>
    </div>
  )
}

SongItem.propTypes = {
  isSelected: PropTypes.bool,
  handleSelection: PropTypes.func,
  song: PropTypes.any,
  index: PropTypes.number,
}

const SongItemReject = ({ song, message }) => {
  const title = scrubTitle(song.title)
  return (
    <div className="track-row track-rejected">
      <div className="col col-num">-</div>
      <div className="col col-name">{decode(title)}</div>
      <div className="col col-position">{message}</div>
    </div>
  )
}

SongItemReject.propTypes = {
  song: PropTypes.any,
  message: PropTypes.string,
}

const AlbumItem = ({ isSelected, handleSelection, song }) => {
  const title = scrubTitle(song.title)
  const imgSrc = song.image && song.image.square ? song.image.square.src : null
  return (
    <div
      className={`album-item ${isSelected ? 'album-selected' : ''}`}
      onClick={handleSelection}
    >
      <div className="album-art-wrapper">
        {imgSrc ? (
          <img src={imgSrc} alt={decode(title)} className="album-art-img" />
        ) : (
          <div className="album-art-placeholder">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#bbb"
                strokeWidth="1"
              />
              <circle cx="12" cy="12" r="3" fill="#bbb" />
            </svg>
          </div>
        )}
      </div>
      <div className="album-title">{decode(title)}</div>
    </div>
  )
}

AlbumItem.propTypes = {
  isSelected: PropTypes.bool,
  handleSelection: PropTypes.func,
  song: PropTypes.any,
}

export { SongItem, SongItemReject, AlbumItem }
