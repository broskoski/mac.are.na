import React from 'react'

class PlaylistDisplay extends React.Component {
  render () {
    const item = this.props.item
    if (!item) {
      return (<div className="pv3"><h5>&nbsp;</h5></div>)
    }
    return (
      <div className="pv3">
        <h5>
          Now playing: {item.title}
        </h5>
      </div>
    )
  }
}

export default PlaylistDisplay