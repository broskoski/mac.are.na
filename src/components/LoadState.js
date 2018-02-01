import React from 'react'

const LoadState = () => {
  return (
    <div id="loader-container" className="abs-fill">
      <div className="loader">
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="40" height="40" strokeWidth="4" shapeRendering="crispEdges"></rect>
        </svg>
      </div>
    </div>
  )
}

export default LoadState
