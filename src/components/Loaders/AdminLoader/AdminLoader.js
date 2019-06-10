import React from 'react'
import { Loader } from 'semantic-ui-react'

import './AdminLoader.css'

const StandardLoader = props => {

    return <Loader className='standard-loader'
                   active
                   content={props.text}
                   inline='centered'
                   size='small' />
           
}

export default StandardLoader;