import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { decode } from 'he'

const LinkItem = ({ status, isSelected, handleSelection, text, to }) => {
  const itemClasses = 'list-item'
  const isSelectedClassNames = classnames({
    'bg-near-white': isSelected,
    'hover-bg-near-white': !isSelected
  })

  return (
    <Link
      key={`link-to-${to}`}
      className={`${itemClasses} ${isSelectedClassNames} ${status}`}
      to={to}
    >
      <p>{decode(text)}</p>
    </Link>
  )
}

export default LinkItem
