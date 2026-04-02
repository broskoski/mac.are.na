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

export { SongItem, SongItemReject }
