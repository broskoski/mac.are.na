import React from 'react'
import PropTypes from 'prop-types'
import { getURL } from '../lib/core'

const SourceLink = ({ block }) => {
  if (block) {
    const source = getURL(block)
    return (
      <div className={'tile-wrap'}>
        <a target={'_blank'} href={`${source}`}>
          {'Source'}
        </a>
      </div>
    )
  }
  return <div />
}

SourceLink.propTypes = {
  block: PropTypes.any
}

export default SourceLink
