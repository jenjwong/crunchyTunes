import React from 'react';
import _ from 'underscore';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
const dummyText = 'Don\'t like the music? Click on the buttons below to overthrow the dictator.';
import {Button, IconButton} from 'react-toolbox/lib/button';
import socket from './websockets.js';


class VotingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      temperature: 'Vote!',
    };
  }

  componentDidMount() {
  socket.on('temperatureUpdate', (temp) => {
    console.log('setTem', temp)
    this.setState({temperature: temp.temperature})
  })
  }

  render() {
    return (
  <Card style={{width: '350px'}} raised>
  <CardTitle
    title={'The pleebs are ' + this.state.temperature + '% content'}
    subtitle= {dummyText}
  />
  <CardActions>

  </CardActions>
  </Card>

    );
  }
}

export default VotingComponent;
