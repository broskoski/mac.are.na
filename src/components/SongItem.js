import React from 'react'
import classnames from 'classnames'
import { decode } from 'he'
import { scrubTitle } from '../lib/helpers'

const SongItem = ({ isSelected, handleSelection, song }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-light-pink': isSelected,
    'hover-bg-washed-red': !isSelected,
  })
  const title = scrubTitle(song.title)
    return (
      <button
        key={`button-play-${song.id}`}
        className={`${itemClasses} ${isSelectedClassNames}`}
        onClick={handleSelection}>
          {decode(title)}
        </button>
  )
}

const SongItemReject = ({ isSelected, handleSelection, song }) => {
  const itemClasses = 'list-item rejected bb pv3'
  const title = scrubTitle(song.title)
    return (
      <div
        key={`button-reject-${song.id}`}
        className={`${itemClasses}`}>
          {`${decode(title)}`}
      </div>
    )
}


export {
  SongItem,
  SongItemReject,
}
