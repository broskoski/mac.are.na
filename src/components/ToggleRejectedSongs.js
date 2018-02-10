import React from 'react'
import PropTypes from 'prop-types'

import classnames from 'classnames'
import sortArrow from '../assets/sortArrow.svg'

const ToggleRejectedSongs = ({
  toggleShowRejects,
  rejectCount,
  showRejects
}) => {
  const openClosedClasses = classnames({
    up: showRejects,
    down: !showRejects
  })
  return (
    <button
      id={'hide-show-rejects'}
      className={'list-item'}
      onClick={() => toggleShowRejects()}
    >
      <div className={'flexBetween'}>
        <p>{`${rejectCount} unplayable blocks`}</p>
        <img
          alt={`sort-${openClosedClasses}`}
          className={openClosedClasses}
          src={sortArrow}
        />
      </div>
    </button>
  )
}

ToggleRejectedSongs.propTypes = {
  toggleShowRejects: PropTypes.func,
  rejectCount: PropTypes.number,
  showRejects: PropTypes.bool
}

export default ToggleRejectedSongs
