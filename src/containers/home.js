import React from 'react'
import { apiBase, playlistChannel } from '../config'
import PlaylistLink from '../components/playlist_link'
import Header from '../components/header'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      per: 100,
      playlists: [],
    }
  }
  componentWillMount() {
    const component = this
    fetch(`${apiBase}/channels/${playlistChannel}/contents?page=${this.state.page}&per=${this.state.per}`)
      .then(function(response) {
        return response.json();
      }).then(function(response) {
        const playlists = response.contents;
        component.setState({ playlists });
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
  }
  render () {
    let playlists = []
    for (var i=0; i < this.state.playlists.length; i++) {
      playlists.push(
        <PlaylistLink
          key={this.state.playlists[i].id} 
          playlist={this.state.playlists[i]} 
        />
      );
    }
    return (
      <div className='w-100 min-vh-100 pa3 pa5-ns'>
        <Header />
        {playlists}
      </div>
    )
  }
}

export default Home