import React from 'react'
import classnames from 'classnames'
import { decode } from 'he'
import { scrubTitle } from '../lib/helpers'

const SongItem = ({ status, isSelected, handleSelection, song }) => {
  const itemClasses = 'list-item'
  const isSelectedClassNames = classnames({
    'bg-selected': isSelected,
    '': !isSelected
  })
  const title = scrubTitle(song.title)
  return (
    <button
      key={`button-play-${song.id}`}
      className={`${itemClasses} ${isSelectedClassNames}`}
      onClick={handleSelection}
    >
      <div>
        <p>{decode(title)}</p>
      </div>
    </button>
  )
}

const SongItemReject = ({ isSelected, handleSelection, song, message }) => {
  const itemClasses = 'list-item rejected'
  const title = scrubTitle(song.title)
  return (
    <div key={`button-reject-${song.id}`} className={`${itemClasses}`}>
      <div className={'flexBetween'}>
        <p>{`${decode(title)}`}</p>
        <p>{`${message}`}</p>
      </div>
    </div>
  )
}

export { SongItem, SongItemReject }
