import React from 'react';

/* STYLES */
import './LinkCard.css'

const linkCard = props => {

    return(
        <div className='link-card'>
            <iframe title='teledisk' 
                    src={props.clip}>
            </iframe>
            <p> {props.performer} - {props.title} </p>
        </div>
    )
}

export default linkCard;