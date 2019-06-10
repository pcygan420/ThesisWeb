import React from 'react';

import ExpectantCard from '../../Cards/ExpectantCard/ExpectantCard'

import './ExpectantList.css'

const ExpectantList = props => {

    return Object.entries(props.expectants).map( ([key,value],i) => {
        
        return <div className='expectant-card-wrapper'
                    key={key}>

                    <ExpectantCard index={i+1} 
                                   id={value.SongId}
                                   title={value.Title} 
                                   performer={value.Performer} 
                                   total={value.Total}/> 
               </div> 
    } )
}

export default ExpectantList;