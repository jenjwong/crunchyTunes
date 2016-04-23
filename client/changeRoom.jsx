import React from 'react';
import socket from './websockets.js'
import {Button, IconButton} from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

class ChangeRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room:''
    };
  }


  componentDidMount () {

    //getting messages emmited from any users
    socket.on('new message', (message) => { 
       
      this.updateMessages(message);
    });
  }

  handleInputChange (room) {
    console.log(room);
    this.setState({
      room: room
    });

  }


  //message from user to all other users




  render() {
    return ( 
      <div ref='chats' className='chats'>
        <Input type="text" style={{ width: '200px' }} label="" icon=""
        onChange={(value) =>this.handleInputChange(value)}  />
        <Button label='Change Room' raised onMouseUp={() => this.props.handleRoomChange(this.state.room)}/>
      </div>
    );
  }
}

export default ChangeRoom;