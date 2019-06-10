import React from 'react';

/* STYLES */
import './Notification.css'

const notification = props => {

    return(
        <div className={props.classes}
             style={{ backgroundColor: props.color }}>
            <span> {props.notification} </span>
        </div>
    )
}

export default notification;