import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';


class GetName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true,
    };
  }

  handleToggle() {
    console.log('clicked')
    this.setState({
     active: false,
   });
  }


  render() {
    return (
      <div>
      <Dialog
       active={this.state.active}
       onEscKeyDown={this.handleToggle}
       onOverlayClick={this.handleToggle}
       title='My awesome dialog'
     >
     <Button label='Join' onClick={this.handleToggle.bind(this)} />
      <Input > </Input>
      </Dialog>

      </div>
    );
  }
}

export default GetName;
