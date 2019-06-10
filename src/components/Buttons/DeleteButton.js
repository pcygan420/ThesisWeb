import React from 'react'
import { Button,
         Icon } from 'semantic-ui-react'

const deleteButton = props => {
    
    return <Button color='grey'
                   loading={props.loading}
                   onClick={props.clicked}> 
                   
                <Icon name ='trash alternate'
                      style={{ marginRight: '0' }} /> Usuń
           </Button>
}

export default deleteButton;