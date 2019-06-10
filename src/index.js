import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Axios from 'axios';

/* STYLES and COMPONENTS */
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import App from './App';

Axios.defaults.baseURL =  //'http://localhost:59821'
'https://pracaapi20190102122538.azurewebsites.net'

const app = (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)

ReactDOM.render(<div style={{ height: '100%' }}>
                    <div className='app-dimmer'> </div>
                        {app}
                </div>, document.getElementById('root'));
