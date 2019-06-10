import React from 'react'
import { NavLink } from 'react-router-dom'

import { Button,
         Icon } from 'semantic-ui-react'

/* STYLES */
import './RegisterComplete.css'

const successLog = props => {

    return(        
        <div className='register-message'>
            <div style={{ width: '100%', 
                          textAlign: 'center' }}>
                
                <Icon name="check circle outline" 
                      size="massive"
                      style={{ color: '#2185d0' }} />
            </div>

            <div>

                <p style={{ marginBottom: '3px' }}> Dziękujemy za założenie konta na serwisie. </p>
                <p> Teraz możesz zalogować się na stronie. </p>

                <Button as={NavLink}
                        to='/konto/logowanie'
                        content='Logowanie' />

                <Button content='Rejestracja'
                        style={{ marginLeft: '10px' }}
                        onClick={props.toggle} />
            </div>
        </div>
    )
}

export default successLog;