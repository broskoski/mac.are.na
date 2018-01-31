import React from 'react'
import classnames from 'classnames'
import { decode } from 'he'

const SongItem = ({status, isSelected, handleSelection, song }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-near-white': isSelected,
    'hover-bg-near-white': !isSelected,
  })

  if (song.title) {
    return (
      <button
        key={`button-play-${song.id}`}
        className={`${itemClasses} ${isSelectedClassNames} ${status}`}
        onClick={handleSelection}>
          {decode(song.title)}
        </button>
    )
  } else {
    return <div className={'list-item'}>{'Invalid Track :('}</div>
  }

}


export default SongItem
