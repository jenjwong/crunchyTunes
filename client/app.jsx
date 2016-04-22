import React from 'react';
import Nav from './nav.js';
import SongPlayer from './songplayer.jsx';
import CardsContainer from './cardsContainer.jsx';
import AppBar from 'react-toolbox/lib/app_bar';
import queryAll from './queryAll.js';
import _ from 'underscore';
import Button from 'react-toolbox/lib/button';
import ChatBox from './chatBox.jsx'
import io from 'socket.io-client';
import PlayList from './playList.jsx';
import { Layout, NavDrawer, Panel, Sidebar, IconButton} from 'react-toolbox';
import socket from './websockets.js';
import LoginModal from './LoginModal.jsx';
import VotingComponent from './VotingComponent.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userId: '',
      role: 'pleeb',
      mood: 1,

      tracks: [
        {
          artist: 'Yeezy',
          apiSource: 'test',
        },
      ],
      currentTrack: {
        artist: 'Yeezy',
        apiSource: 'test',
      },
      searching: false,
      sidebarPinned: false
    };
  }

  componentDidMount() {
    socket.on('user joined', (user) => {
      this.setState(
        { username: user.username,
          userId: socket.id });
    });
    socket.on('assignDictator', (track) => {
      console.log('i am dictator', this.state.userId)
    });

    socket.on('update track', (track) => {
      this.handleCardPlay(track);
    });

    const self = this;
    queryAll({ query: 'Kanye',
      })
      .then((results) => {
        console.log(results);
        self.setState({
          tracks: results,
        });
      });
  }

  handleCardPlay(track) {
    this.setState({
      currentTrack: track,
    });
  }

  handleSearch(value) {
    const self = this;
    if (value === null) {
      this.setState({
        searching: false,
      });
    }
    this.setState({
      searching: true,
    });
    queryAll({ query: value })
      .then((results) => {
        self.setState({
          tracks: results,
          searching: false,
        });
      });
  }

  toggleSidebar() {
    this.setState({ sidebarPinned: !this.state.sidebarPinned});
  }


  render() {
    return (
      <div>
        <Layout className='layout'>
          <NavDrawer active={true}
                    pinned={true}
                    className='navDrawer'
                    >
            <PlayList handleCardPlay = {this.handleCardPlay.bind(this)} />
          </NavDrawer>
            <Panel>
          <AppBar className="appBar" >
            <SongPlayer track = {this.state.currentTrack} />
          </AppBar>
          <Nav className="searchBar" handleSearch = { this.handleSearch.bind(this) } searching={ this.state.searching } />
            <CardsContainer tracks = {this.state.tracks}
              handleCardPlay = {this.handleCardPlay.bind(this)}
            />
          </Panel>
          <Sidebar className='sideBar' pinned={ this.state.sidebarPinned } width={ 5 }>
            <ChatBox toggleSidebar={this.toggleSidebar.bind(this)} username={this.state.username }/>
          </Sidebar>
          <div><Button icon={this.state.sidebarPinned ? 'close' : 'inbox'} label='Chat' onClick={ this.toggleSidebar.bind(this) }/></div>
      </Layout>
      <LoginModal />
    </div>
    );
  }
}

export default App;
