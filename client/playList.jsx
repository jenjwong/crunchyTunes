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
      <div className="playlist">
        <ListItem
          avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
          caption='Title'
          legend="Artist"
        />
       
      </div>
    );
  }

}

export default PlayList;