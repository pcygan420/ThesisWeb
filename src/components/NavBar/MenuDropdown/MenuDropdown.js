import React from 'react';
import { Dropdown } from 'semantic-ui-react';

/* STYLES */
import './MenuDropdown.css'

const menuDropdown = props => {

    return(
        <Dropdown className="user-dropdown" 
                  icon="angle down"
                  text={localStorage.getItem('userName')}>
            <Dropdown.Menu className='user-dropdown-menu'>
                <Dropdown.Item as={'a'} 
                               href="/profil" 
                               text="Mój profil" />
                { localStorage.getItem('roles').includes("Admin") ? <Dropdown.Item as={'a'} 
                                                                                   href="/admin/przeglad" 
                                                                                   text="Panel admina" /> : null }
                <Dropdown.Item as={'a'} 
                               text="Wyloguj" 
                               onClick={props.logout}/>                                                                               
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default menuDropdown;