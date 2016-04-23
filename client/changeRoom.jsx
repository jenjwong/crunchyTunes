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
  
  handleInputChange (room) {
    this.setState({
      room: room
    });
  }
  
  render() {
    return ( 
      <div>
        <Input type="text" style={{ width: '200px' }} label="" icon=""
        onChange={(value) =>this.handleInputChange(value)}  />
        <Button className='changeRoom' label='Change Room' raised onMouseUp={() => this.props.handleRoomChange(this.state.room)}/>
      </div>
    );
  }
}

export default ChangeRoom;
