import React from 'react';
import { Grid } from 'semantic-ui-react';

import SongTile from '../Cards/SongTile/SongTile.js'

const PopularList = props => {

    return Object.entries(props.songs).map( ([key,value],i) => {
        return <Grid.Column tablet={16} key={key}> 
                    <SongTile index={i+1} 
                              id={value.Id}
                              key={key}
                              title={value.Title} 
                              votes={value.UpVotes}/> 
                </Grid.Column>
    } )
}

export default PopularList;