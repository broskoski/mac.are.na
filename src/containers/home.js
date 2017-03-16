import React from 'react'
import {Pagination} from 'pui-react-pagination'
import { apiBase, playlistChannel } from '../config'
import PlaylistLink from '../components/playlist_link'
import Header from '../components/header'

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activePage: 1,
      playlists_length: 4,
      per: 20,
      playlists: [],
    }
  }

  componentWillMount() {
    const component = this
    fetch(`${apiBase}/channels/${playlistChannel}/thumb`)
      .then(function(response) {
        return response.json();
      }).then(function(response) {
        const playlists_length = response.length;
        component.setState({ playlists_length });
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })

    fetch(`${apiBase}/channels/${playlistChannel}/contents?page=${this.state.activePage}&per=${this.state.per}`)
      .then(function(response) {
        return response.json();
      }).then(function(response) {
        const playlists = response.contents;
        component.setState({ playlists });
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      })
  }

  handleSelect(event, selectedEvent) {

    const eventKey = selectedEvent.eventKey;
    const activePage = this.state.activePage;
    const maxPage = Math.ceil(this.state.playlists_length / this.state.per);

    if(eventKey === 'next') {
      if(activePage !== maxPage) {
        console.log(this.setState({activePage: activePage + 1}));
        // return this.updatePlaylist(pageUpdate);
      } else {
        return this.setState({activePage: maxPage});
      }
    }
    if(eventKey === 'prev') {
      if(activePage !== 1) {
        const pageUpdate = this.setState({activePage: activePage - 1});
        return this.updatePlaylist(pageUpdate);
      } else {
        return this.setState({activePage: 1});
      }
    }
    this.setState({activePage: selectedEvent.eventKey});
  }

  updatePlaylist(pageUpdate) {

    const component = pageUpdate

    console.log(pageUpdate);

    fetch(`${apiBase}/channels/${playlistChannel}/contents?page=${this.state.activePage}&per=${this.state.per}`)
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
        <Pagination
          items={Math.ceil(this.state.playlists_length / this.state.per)}
          onSelect={this.handleSelect.bind(this)}
          activePage={this.state.activePage}
           />
      </div>
    )
  }
}

export default Home

