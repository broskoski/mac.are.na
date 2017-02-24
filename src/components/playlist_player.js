import React from 'react'

class PlaylistPlayer extends React.Component {
  render () {
    const item = this.props.item
    if (!item) {
      return (<div />)
    }
    return (
      <div/>
    )
  }
}

export default PlaylistPlayer