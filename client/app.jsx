import React from 'react';
import Nav from './nav.js';
import SongPlayer from './songplayer.jsx';
import CardsContainer from './cardsContainer.jsx';
import AppBar from 'react-toolbox/lib/app_bar';
import queryAll from './queryAll.js';
import Button from 'react-toolbox/lib/button';
import ChatBox from './chatBox.jsx'
import io from 'socket.io-client';
import PlayList from './playList.jsx';
import { Layout, NavDrawer, Panel, Sidebar, IconButton} from 'react-toolbox';
import socket from './websockets.js';
import LoginModal from './LoginModal.jsx';
import VotingComponent from './VotingComponent.jsx';
import ChangeRoom from './changeRoom.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: '',
      username: '',
      userId: '',
      dictator: '',
      isDictator: false,
      mood: 1,
      room: 'HR41',

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
      sidebarPinned: false,
    };
  }

  // add something that alters role in state

  componentDidMount() {
    socket.on('user joined', (username) => {
      this.setState(
        { username: username,
          userId: socket.id });
    });
    socket.on('assign dictator', () => {
      console.log('i am dictator', this.state.userId);
      // toggle a dictator symbol on the screen
      this.setState({
        isDictator: true,
        dictator: this.state.username,
      });
    });

    socket.on('update track', (track) => {
      console.log(track);
      this.handleCardPlay(track);
    });

    socket.on('temperatureUpdate', (temp) => {
      console.log('setTem', temp);
      this.setState({ temperature: temp.temperature });
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

    handleRoomChange (room) {
    console.log(room);
    let oldRoom = this.state.room;
    this.setState({
      room: room
    });
    socket.emit('change room', {oldRoom:oldRoom, newRoom:room})
  }

  moodHandler(sentiment) {
    var mood = this.state.mood; // 0 or 1
    if (mood !== sentiment) {
      var oppositeMood = !!sentiment ? 1 : 0;
      this.setState({ mood: oppositeMood });
      socket.emit('mood change', this.state.mood);
    }
    
  }

  render() {
    return (
      <div>
        <Layout className = 'layout'>
          <NavDrawer active = {true}
                    pinned = {true}
                    className = 'navDrawer'
                    >
            <PlayList handleCardPlay = {this.handleCardPlay.bind(this)} room = {this.state.room} />
          </NavDrawer>
            <Panel>
          <AppBar className="appBar" >
            <SongPlayer track = {this.state.currentTrack} room = {this.state.room} /> 
            <ChangeRoom userId = {this.state.userId} 
              handleRoomChange={this.handleRoomChange.bind(this)} 
              room = {this.state.room}/>
          </AppBar>
          <Nav className="searchBar" handleSearch = { this.handleSearch.bind(this) } searching={ this.state.searching } />
          <Button label="Like"  icon='favorite' accent onClick={ () => this.moodHandler(0) } />
          <Button label="Not so much" onClick={ () => this.moodHandler(1) } />
            <CardsContainer tracks = {this.state.tracks}
              handleCardPlay = {this.handleCardPlay.bind(this)}
              room = {this.state.room}
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
