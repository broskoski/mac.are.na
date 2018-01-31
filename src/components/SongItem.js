import React from 'react'
import classnames from 'classnames'
import { decode } from 'he'
import { scrubTitle } from '../lib/helpers'

const SongItem = ({status, isSelected, handleSelection, song }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-near-white': isSelected,
    'hover-bg-near-white': !isSelected,
  })
  const title = scrubTitle(song.title)
    return (
      <button
        key={`button-play-${song.id}`}
        className={`${itemClasses} ${isSelectedClassNames} ${status}`}
        onClick={handleSelection}>
          {decode(title)}
        </button>
  )
}

const SongItemReject = ({ isSelected, handleSelection, song, message }) => {
  const itemClasses = 'list-item rejected bb pv3'
  const title = scrubTitle(song.title)
    return (
      <div
        key={`button-reject-${song.id}`}
        className={`${itemClasses}`}>
          <div className={'flexBetween'}>
            <div>{`${decode(title)}`}</div>
            <div>{`${message}`}</div>
          </div>
      </div>
    )
}


export {
  SongItem,
  SongItemReject,
}
