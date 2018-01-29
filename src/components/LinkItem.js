import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

const LinkItem = ({ isSelected, handleSelection, text, to }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-light-pink': isSelected,
    'hover-bg-washed-red': !isSelected,
  })

  return (
    <Link
      key={`link-to-${to}`}
      className={`${itemClasses} ${isSelectedClassNames}`}
      to={to}>
        {text}
      </Link>
  )
}


export default LinkItem
