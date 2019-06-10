import React from 'react'
import { Dimmer,
         Loader } from 'semantic-ui-react'

import './SmallLoader.css'

const StandardLoader = () => {

    return <Dimmer active 
                   inverted > 
                <Loader size='small'
                        className='small-loader'/> 
           </Dimmer>
}

export default StandardLoader;