import React from 'react';
import { Card } from 'semantic-ui-react'

import { NavLink } from 'react-router-dom'

/* Styles */
import './SongCard.css';

const SongCard = props => {

    return(
        <Card className='song-card' 
              as={NavLink}
              to={'/piosenka/' + props.title + '/' + props.id}>

            <Card.Content>
                <Card.Header> {props.performer} - {props.title} </Card.Header>
                <Card.Meta>
                    Dodał: <span className='card-user'> {props.user} </span>
                </Card.Meta>
                <Card.Description> {props.text} </Card.Description>
            </Card.Content>
        
            <Card.Content extra>
                {props.date}
            </Card.Content>
        </Card>
    )
}

export default SongCard;