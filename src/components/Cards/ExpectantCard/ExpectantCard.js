import React from 'react';
import { Card,
         Icon } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom'; 

import './ExpectantCard.css'

const expCard = props => {

    return(
        <Card className='expectant-card'
              as={NavLink}
              to={'/piosenka/' + props.title + '/' + props.id} > 
            <Card.Content>
                <Icon className='join-icon'
                      name='plus'
                      color='blue'
                      size='large' />

                <Card.Header> { props.title } </Card.Header>
                <Card.Meta> { props.performer } </Card.Meta>
                <Card.Description>
                    <Icon name='user'
                          color='blue' /> { props.total } oczekujących tłumaczenia
                </Card.Description>
            </Card.Content>           
        </Card>
    )
}

export default expCard;