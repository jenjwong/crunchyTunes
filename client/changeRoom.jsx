import React from 'react';
import ReactDOM from 'react-dom';
import socket from './websockets.js'
import currentRoom from './socketRoom'


class ChangeRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    }
  }


  componentDidMount () {

    //getting messages emmited from any users
    socket.on('new message', (message) => { 
       
      this.updateMessages(message);
    });
  }


  //message from user to all other users
  handleSwitchRoom (e) {
    e.preventDefault();
    var room = this.refs.newRoom.value;
    //reset field so user doesn't have to manually fix erase what they just wrote
    this.refs.newRoom.value = '';

    //emit new message to self and all
    socket.emit('change room', {oldRoom:this.props.room, newRoom:room})

  }



  render() {
    return ( 
      <div ref='chats' className='chats'>
        <h1>ChangeRoom</h1>
        <form className="" onSubmit={this.handleSwitchRoom.bind(this)}>
          <input ref='newRoom'/>
        </form>
      </div>
    );
  }
}

export default ChangeRoom;