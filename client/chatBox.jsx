import React from 'react';
import ReactDOM from 'react-dom';
import socket from './websockets.js'

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: null,
      messages: [],
    }
  }

  handleUserInputMessage (e) {
    e.preventDefault();
    var message = this.refs.newMessage.value;
    this.refs.newMessage.value = '';

    //emit new message to all
    socket.emit('new message', message);
    
    
    //get new message from user and update it on their page
    var msgsCopy = this.state.messages.slice();
    msgsCopy.push(message);
    this.setState({'messages': msgsCopy});

    //scroll to bottom so user sees new message
    var domnode = ReactDOM.findDOMNode(this.refs.chats);
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = domnode.scrollHeight;
  }

  handleIncomingMessage (message) {
    socket.on('new message', (message) => {   
    });
  }

  render() {
    return ( 
      <div ref='chats' className='chats'>
        <h1>Chat:</h1>
        {this.state.messages.map((message) => 
          <p>{message}</p>
        )}
        <form className="commentForm" onSubmit={this.handleUserInputMessage.bind(this)}>
          <input ref='newMessage'/>
        </form>
      </div>
    );
  }
}

export default ChatBox;