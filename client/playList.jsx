import React from 'react';
import Button from 'react-toolbox/lib/button';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import ClassNames from 'classnames';
import style from './styles/toolbox-theme';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';


class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
       <List selectable ripple className='list'>
        <ListItem
          avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
          caption='Dr. Manhattan'
          legend="Jonathan 'Jon' Osterman"
          className='listItem'
        />
        <ListItem
          avatar='https://dl.dropboxusercontent.com/u/2247264/assets/o.jpg'
          caption='Ozymandias'
          legend='Adrian Veidt'
          className='listItem'
        />
        <ListItem
          avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
          caption='Rorschach'
          legend='Walter Joseph Kovacs'
          className='listItem'
        />
      </List>
    );
  }

}

export default PlayList;