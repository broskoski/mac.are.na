import React from 'react'

const LoadState = () => {
  return (
    <div className="loader-wrap">
      <div className="loader">
        <svg
          width="24"
          height="24"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            strokeWidth="4"
            shapeRendering="crispEdges"
          />
        </svg>
      </div>
    </div>
  )
}

export default LoadState
