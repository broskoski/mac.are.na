import React from 'react'
import { unescape } from 'lodash'

class PlaylistItem extends React.Component {
  render () {
    const item = this.props.item
    const itemClass = "bb pv3 bg-animate"
    const selectedClass = (
      this.props.isSelected ?
      itemClass + ' bg-light-pink ' :
      itemClass + ' hover-bg-washed-red'
    )
    return (
      <div
        style={{ cursor: "pointer" }}
        className={selectedClass}
        onClick={() => this.props.onPress(item.id)}
      >
        <a className="list-item link dim black">
          {unescape(item.title)}
        </a>
      </div>
    )
  }
}

export default PlaylistItem
