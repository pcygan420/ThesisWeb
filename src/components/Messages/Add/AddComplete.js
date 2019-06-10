import React from 'react'
import { Icon } from 'semantic-ui-react'

/* STYLES */
import './AddComplete.css'

const successLog2 = props => {

    return(

        <div className="add-message">
            <div className="message-icon">
                <Icon name='check' />
            </div>
            <div className="message-body">
                <p> Super! {props.message} </p>
                <p className="u-italic"> Po pomyślnej weryfikacji dane zostaną wprowadzone do bazy (poprawność jest sprawdzana). </p>

                {   props.newButton ? 
                    <button id="js-helpMe" 
                            className="message-button"
                            onClick={props.new}> {props.newButton}
                    </button> : null
                }
                <button className="message-button js-messageClose"
                        onClick={props.main}> 
                    Strona główna
                </button>
            </div>
            <button className="message-close"
                    onClick={props.close}> <Icon name='close'/>
            </button>
        </div>
    )
}

export default successLog2;