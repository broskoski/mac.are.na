import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { decode } from 'he'

const LinkItem = ({status, isSelected, handleSelection, text, to }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-near-white': isSelected,
    'hover-bg-near-white': !isSelected,
  })

  return (
    <Link
      key={`link-to-${to}`}
      className={`${itemClasses} ${isSelectedClassNames} ${status}`}
      to={to}>
        {decode(text)}
      </Link>
  )
}


export default LinkItem
