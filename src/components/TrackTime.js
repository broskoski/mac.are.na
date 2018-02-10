import React from 'react'
import PropTypes from 'prop-types'

const TrackTime = ({ time, trackInfo }) => {
  if (trackInfo) {
    return (
      <div className="tile-wrap track-time">
        <p>{time}</p>
      </div>
    )
  }
  return (
    <div className="tile-wrap track-time">
      <p>{'--:-- / --:-- '}</p>
    </div>
  )
}

TrackTime.propTypes = {
  time: PropTypes.string,
  trackInfo: PropTypes.any
}

export default TrackTime
