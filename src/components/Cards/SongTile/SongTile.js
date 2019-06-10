import React from 'react';
import { Icon } from 'semantic-ui-react'

import { NavLink } from 'react-router-dom'

/* Styles */
import './SongTile.css';

const SongTile = props => {

    return (
        <div className="song-tile">
            <div className="song-tile-number"> 
                { props.index }         
            </div>

            <div className="song-tile-content"> 
                <NavLink to={'/piosenka/' + props.title + '/' + props.id }> 
                    { props.title } 
                </NavLink> 
            </div>

            <div className="song-tile-rating"> 
                <Icon name='thumbs up outline'
                      style={{ fontSize: '20px' }} /> { props.votes } 
            </div>
        </div>
    )
}

export default SongTile;