import React from 'react'
import { Dimmer,
         Loader } from 'semantic-ui-react'

import './Loader.css'

const StandardLoader = () => {

    return <Dimmer active 
                   inverted > 
                <Loader size='large'
                        className='standard-loader'> 
                    Ładowanie  
                </Loader> 
           </Dimmer>
}

export default StandardLoader;

