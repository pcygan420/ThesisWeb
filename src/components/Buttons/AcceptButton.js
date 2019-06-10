import React from 'react'
import { Button,
         Icon } from 'semantic-ui-react'

const acceptButton = props => {
    
    return <Button color='blue'
                   loading={props.loading}
                   onClick={props.clicked}> 

                <Icon name ='check circle outline'
                      style={{ marginRight: '0' }} /> Zatwierdź
           </Button>
}

export default acceptButton;

