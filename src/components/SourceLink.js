import React from 'react'
import PropTypes from 'prop-types'
import { getURL } from '../lib/core'

const SourceLink = ({ trackInfo }) => {
  if (trackInfo) {
    const source = getURL(trackInfo)
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
  trackInfo: PropTypes.any
}

export default SourceLink
