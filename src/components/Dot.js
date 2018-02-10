import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { playerStates } from '../lib/helpers'

const Dot = ({ playerStatus }) => {
  const playerStatusClasses = classnames({
    playerIdle: playerStatus === playerStates.idle,
    playerPlaying: playerStatus === playerStates.playing,
    playerBuffering: playerStatus === playerStates.buffering,
    playerErrored: playerStatus === playerStates.errored,
    dot: true
  })
  return (
    <div className={'tile-wrap-square'}>
      <div key={'dot'} className={playerStatusClasses} />
    </div>
  )
}

Dot.propTypes = {
  playerStatus: PropTypes.any
}

export default Dot
