import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';


class GetName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true,
      name: name,
    };
  }

  handleToggle() {
    this.setState({
     active: false,
   });

   var username;
   username = this.state.name

   function setUsername () {
     console.log(username)
      if (username) {
        socket.emit('add user', username);
      }
    }
    setUsername().bind(this);
  }


  handleChange(name, value) {
    console.log('handleChange')
    this.setState({
     [name]: value,
   });
  }



  render() {
    return (
      <div>
      <Dialog
       active={this.state.active}
       onEscKeyDown={this.handleToggle}
       onOverlayClick={this.handleToggle}
       title='Enter Music Dictator'
     >
      <Button label='Join' onClick={this.handleToggle.bind(this)} />
      <Input type='text' label='Name' name='name' value={this.state.name} onChange={this.handleChange.bind(this, 'name')} maxLength={16 } />
      </Dialog>

      </div>
    );
  }
}

export default GetName;
