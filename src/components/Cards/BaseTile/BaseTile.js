import React from 'react';
import { Card,
         Icon,
         List } from 'semantic-ui-react'

import { NavLink } from 'react-router-dom'

/* Styles */
import './BaseTile.css';

const BaseTile = props => {

    var halfstar = null;
    if( props.rate - Math.floor(props.rate) > 0.5)
        halfstar = <Icon name='star half' color='blue' />

    return(
        <Card className='base-tile'>
            <Card.Content>
                <Card.Header> 
                    <NavLink to={'/piosenka/' + props.title + '/' + props.id} >{props.title}</NavLink> 
                    { props.userRate ? <span> <span>{props.userRate}</span>/5 </span> : null }
                </Card.Header>

                <Card.Meta>
                    <span className='date'>{props.performer}</span>
                </Card.Meta>

                <Card.Description>
                    <List horizontal>
                        { props.album ? <List.Item> Album: <span>{props.album}</span> </List.Item> : null } 
                        { props.genres ? <List.Item> Gatunki: <span>{props.genres}</span> </List.Item> : null } 
                        { props.duration ? <List.Item> Czas trwania: <span>{props.duration} min.</span> </List.Item> : null } 
                        { props.publication ? <List.Item> Rok wydania: <span>{props.publication} r.</span> </List.Item> : null } 
                    </List>
                </Card.Description>
            </Card.Content>

            <Card.Content extra>
                <div className='avg-rate'> 
                    { props.rate.toFixed(1) } 
                    {
                        [...Array(Math.floor(props.rate))].map((e, i) => <Icon name='star' color='blue' key={i} />)
                    }

                    { halfstar }

                </div>
                <a>
                    <Icon name='user'
                          color='blue' /> { props.votes } {props.votes < 5 ? "oceny" : "ocen" }
                </a>
            </Card.Content>
        </Card>
    )
}

export default BaseTile;