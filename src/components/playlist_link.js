import React from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'

const ListItemLink = ({ isSelected, handleSelection, text, to }) => {
  const itemClasses = 'list-item bb pv3 bg-animate'
  const isSelectedClassNames = classnames({
    'bg-light-pink': isSelected,
    'hover-bg-washed-red': !isSelected,
  })

  return (
    <button className={`${itemClasses} ${isSelectedClassNames}`} onClick={handleSelection}>
      <Link className={'innerLink'} to={to}>{text}</Link>
    </button>
  )
}


export default ListItemLink
