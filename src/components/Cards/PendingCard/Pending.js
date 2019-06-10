import React from 'react';
import { Icon } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';

/* STYLES */
import './PendingCard.css'

const pendingCard = props => {

    return(
        <div className='pending-card'
             style={{ border: '1px solid ' + props.color }}>

            <div className='content'
                 style={{ backgroundColor: props.color }}>
                <div className='icon-wrapper'> 
                    <Icon name={props.icon}
                          size='huge' />
                </div>

                <div className='data'> 
                    <span> {props.total} </span>
                    <span> {props.data} </span>
                </div>
            </div>
            
            <div className='meta'>
                <NavLink style={{ color: props.color }} 
                         to={props.to}> Zobacz szczegóły </NavLink>
                         
                <Icon name='arrow alternate circle right'
                      style={{ color: props.color }} />
            </div>
        </div>
    )
}

export default pendingCard;