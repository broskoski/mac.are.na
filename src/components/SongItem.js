import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

const SongItem = ({ isSelected, handleSelection, song }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-light-pink': isSelected,
    'hover-bg-washed-red': !isSelected,
  })
  return (
    <button
      key={`button-play-${song.id}`}
      className={`${itemClasses} ${isSelectedClassNames}`}
      onClick={handleSelection}>
        {decodeURIComponent(song.title)}
      </button>
  )
}


export default SongItem
