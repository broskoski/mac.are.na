import React from 'react'
import PropTypes from 'prop-types'
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

LinkItem.propTypes = {
  status: PropTypes.string,
  isSelected: PropTypes.bool,
  handleSelection: PropTypes.func,
  text: PropTypes.string,
  to: PropTypes.string
}

export default LinkItem
