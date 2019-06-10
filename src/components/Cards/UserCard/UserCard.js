import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card, 
         Image } from 'semantic-ui-react';

/* STYLES */
import './UserCard.css';

const userCard = props => {

    return (
        <Card className='user-card'>
            <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' style={{ width: '150px', margin: 'auto', borderRadius: '0' }}/>
            <Card.Content>
                <Card.Header> {props.rank}. <NavLink to={'/profil/' + props.userName}>{props.userName}</NavLink> </Card.Header>
                <Card.Meta>
                    <span className='date'>Dołączył {props.joined}</span>
                </Card.Meta>
                {/*<Card.Description>{props.about}</Card.Description>*/}
            </Card.Content>

            <Card.Content extra>
                <a> {props.points} punktów </a>
            </Card.Content>
        </Card>
    )
}

export default userCard;
