import React from 'react';

/* Components */
import SongCard from '../../Cards/SongCard/SongCard.js'

/* Styles */
import './SongsList.css'

const SongsList = props => {

    return Object.entries(props.songs).map( ([key,value],i) => {

            return( <div className='song-card-wrapper'
                         key={key} >

                        <SongCard id={value.Id} 
                            key={key} 
                            user={value.User}
                            performer={value.Performer}
                            title={value.Title} 
                            text={value.Text} 
                            date={value.AddDate} /> 
                    </div> 
            )
    } )
}

export default SongsList;