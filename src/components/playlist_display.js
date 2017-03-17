import React from 'react'
import { unescape } from 'lodash'

class PlaylistDisplay extends React.Component {
  render () {
    const item = this.props.item
    if (!item) {
      return (<div className="pv3"><h4>◼ [stopped]</h4></div>)
    }
    return (
      <div className="pv3">
        <h4>
          ► {unescape(item.title)}
        </h4>
      </div>
    )
  }
}

export default PlaylistDisplay