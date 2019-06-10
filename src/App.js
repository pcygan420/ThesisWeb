import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

/* Containers */
import AdminPanel from './containers/AdminPanel/AdminPanel.js';
import Website from './containers/App/Website.js';

/* Styles */
import './App.css'

class App extends Component {

  render() {

    return (
          <Switch>                
            <Route path='/admin' component={AdminPanel} />  
            <Route path='/' component={Website} />
          </Switch>         
    );
  }
}

export default App;
