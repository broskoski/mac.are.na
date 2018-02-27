import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { decode } from 'he'

const SongItem = ({ status, isSelected, handleSelection, block }) => {
  const itemClasses = 'list-item'
  const isSelectedClassNames = classnames({
    'bg-selected': isSelected,
    '': !isSelected
  })
  const title = block.validation.sanitizers.fillTitle
  return (
    <button
      key={`button-play-${block.id}`}
      className={`${itemClasses} ${isSelectedClassNames}`}
      onClick={handleSelection}
    >
      <div>
        <p>{decode(title)}</p>
      </div>
    </button>
  )
}

SongItem.propTypes = {
  status: PropTypes.string,
  isSelected: PropTypes.bool,
  handleSelection: PropTypes.func,
  block: PropTypes.any
}

const SongItemReject = ({ isSelected, handleSelection, block }) => {
  const itemClasses = 'list-item rejected'
  const title = block.validation.sanitizers.fillTitle
  return (
    <div key={`button-reject-${block.id}`} className={`${itemClasses}`}>
      <div className={'flexBetween'}>
        <p>{`${decode(title)}`}</p>
      </div>
    </div>
  )
}

SongItemReject.propTypes = {
  isSelected: PropTypes.bool,
  handleSelection: PropTypes.func,
  block: PropTypes.any,
  message: PropTypes.string
}

export { SongItem, SongItemReject }
