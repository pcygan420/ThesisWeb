import React, { Component } from 'react';
import { Container,
         Grid,
         Icon,
         Menu,
         Segment } from 'semantic-ui-react';

import { Route,Switch,Link,withRouter } from 'react-router-dom';

import $ from "jquery";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

import { logout } from '../../api/api.js'

/* STYLES */
import './AdminPanel.css'

/* Components */
import Songs from './Songs/Songs.js'
import SongForm from './Songs/Song/Song.js'
import AddedSongs from './AddedSongs/AddedSongs.js'
import AddedSongForm from './AddedSongs/AddedSong/AddedSong.js'
import Texts from './Texts/Texts.js'
import TextForm from './Texts/Text/Text.js'
import Clips from './Clips/Clips.js'
import Translations from './Translations/Translations.js'
import TranslationForm from './Translations/Translation/Translation.js'
import Metrics from './Metrics/Metrics.js'
import MetricForm from './Metrics/Metric/Metric.js'
import Main from './Main/Main.js'

import Notification from '../../components/Messages/Notification/Notification.js'

class AdminPanel extends Component {

    state = { 
        user: '',
        activeItem: 'home', 
        activeSidebarItem: 'general',
        classes: 'notification',
        color: '#141414',
        notification: 'Zaakceptowano element'
    }

    componentWillMount = () => {
        this.setState({ user: localStorage.getItem('userName') })
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    
    handleSidebarItemClick = (e, { name }) => this.setState({ activeSidebarItem: name })

    setSidebarItem = (name) => this.setState({ activeSidebarItem: name })

    menuToggleHandleClik = (e, { name }) => {
        this.handleItemClick(e, { name });
        
        const isClosed = $('#sidebar').css('display') === 'none' ? true : false;        

        if(isClosed)
            $('#sidebar').css('display','inline');
        else
            $('#sidebar').css('display','none');
    }

    handleNotification = (type) => {
        var that = this;

        switch(type) {
            case 'Delete':
                this.setState({ color: '#141414', 
                                notification: 'Element usunięto', 
                                classes: 'notification animate' })
                break;

            case 'Accept':
                this.setState({ color: '#2185d0', 
                                notification: 'Element zaakceptowano', 
                                classes: 'notification animate'})        
                break;

            case 'Edit':
                this.setState({ color: '#2185d0', 
                                notification: 'Element edytowano', 
                                classes: 'notification animate'})        
                break;

            default:
                this.setState({ color: '#b72821', 
                                notification: 'Wystąpił błąd :(', 
                                classes: 'notification animate'})
                break;
        }

        setTimeout(function() { that.removeAnimation() }, 5000)
    }

    removeAnimation() {
        this.setState({ classes: 'notification' })
    }

    onLogoutHandler() {
        logout();      
    }

    render() {

        const { activeItem,
                activeSidebarItem,
                classes,
                color,
                notification } = this.state;

        return(
            <Container fluid style={{ maxWidth: '1920px', height: '100%', padding: '0' }}>
              <Menu inverted style={{ margin: '0' }}>

                    <Menu.Item name='' 
                               id="menu-toggle"
                               active={activeItem === 'menu-toggle'} 
                               onClick={this.menuToggleHandleClik}
                               icon={ <Icon name="bars"/>} />
                     
                    <Menu.Menu position='right'>
                        <Menu.Item name={this.state.user}
                                   onClick={this.handleItemClick}
                                   icon={ <Icon name='user' />} /> 

                        <Menu.Item name='Wyloguj'
                                   active={activeItem === 'Wyloguj'}
                                   as={ Link }
                                   to='/'
                                   onClick={this.onLogoutHandler}
                                   icon={ <Icon name='log out' />} />
                    </Menu.Menu>
                </Menu>

                <Grid style={{ height: '896px' }}>
                    <Grid.Row style={{ display: 'flex', height: '100%', paddingTop: '0px', overflow: 'hidden' }}>
                        <Grid.Column id="sidebar" style={{ padding: '0' }}>

                            <Menu id="menu" 
                                  className="admin-panel" 
                                  secondary 
                                  vertical >

                                <Menu.Item as={ Link } 
                                           to='/admin/przeglad'
                                           name='general'
                                           active={activeSidebarItem === 'general'}
                                           onClick={this.handleSidebarItemClick} >
                                           <Icon name="home" /> Przegląd
                                </Menu.Item>
                                
                                <div className="ui hidden divider"></div>

                                <Menu.Item as={ Link } 
                                           to='/admin/piosenki'
                                           name='songs'
                                           active={activeSidebarItem === 'songs'}
                                           onClick={this.handleSidebarItemClick} > 
                                           <Icon name="music" /> Piosenki
                                </Menu.Item>

                                <div className="ui hidden divider"></div>
                                
                                <Menu.Item as={ Link } 
                                           to='/admin/dodane-piosenki'
                                           name='added-songs'
                                           active={activeSidebarItem === 'added-songs'}
                                           onClick={this.handleSidebarItemClick} > 
                                           <Icon name="file text"/> Dodane piosenki
                                </Menu.Item>

                                <Menu.Item as={ Link } 
                                           to="/admin/teksty"
                                           name='texts'
                                           active={activeSidebarItem === 'texts'}
                                           onClick={this.handleSidebarItemClick} > 
                                           <Icon name="file alternate outline"/> Teksty
                                </Menu.Item>

                                <Menu.Item as={ Link } 
                                           to="/admin/dodane-tlumaczenia"
                                           name='added-translations'
                                           active={activeSidebarItem === 'added-translations'}
                                           onClick={this.handleSidebarItemClick} > 
                                           <Icon name="file alternate outline"/> Tłumaczenia
                                </Menu.Item>

                                <Menu.Item as={ Link } 
                                           to='/admin/clipy'
                                           name='added-Clips'
                                           active={activeSidebarItem === 'added-Clips'}
                                           onClick={this.handleSidebarItemClick} > 
                                           <Icon name="file outline"/> Clipy
                                </Menu.Item>

                                <Menu.Item as={ Link } 
                                           to='/admin/metryki'
                                           name='added-metrics'
                                           active={activeSidebarItem === 'added-metrics'}
                                           onClick={this.handleSidebarItemClick} > 
                                           <Icon name="file outline"/> Metryki
                                </Menu.Item>
                            </Menu>
                        </Grid.Column>       

                        <Grid.Column id="content">
                            <Segment>          
                                <Switch>
                                    <Route exact 
                                           path="/admin/przeglad" 
                                           render={(props) => <Main {...props} /> } />

                                    <Route exact 
                                           path="/admin/piosenki" 
                                           component={Songs} />

                                    <Route exact 
                                           path="/admin/clipy" 
                                           render={(props) => <Clips {...props} notification={this.handleNotification} /> } />

                                    <Route exact 
                                           path="/admin/dodane-piosenki" 
                                           component={AddedSongs} />

                                    <Route exact 
                                           path='/admin/teksty' 
                                           component={Texts} />

                                    <Route exact 
                                           path='/admin/metryki' 
                                           component={Metrics} />

                                    <Route exact 
                                           path="/admin/dodane-tlumaczenia" 
                                           component={Translations} />
        
                                    <Route exact 
                                           path="/admin/piosenki/:id" 
                                           render={(props) => <SongForm {...props} notification={this.handleNotification} /> }/>

                                    <Route exact 
                                           path="/admin/dodane-piosenki/:pathParam1" 
                                           render={(props) => <AddedSongForm {...props} notification={this.handleNotification} />} />

                                    <Route exact 
                                           path="/admin/dodane-tlumaczenia/:pathParam1" 
                                           render={(props) => <TranslationForm {...props} notification={this.handleNotification}/> } /> 

                                    <Route exact 
                                           path="/admin/teksty/:pathParam1" 
                                           render={(props) => <TextForm {...props} notification={this.handleNotification}/> } /> 

                                    <Route exact 
                                           path="/admin/metryki/:pathParam1" 
                                           render={(props) => <MetricForm {...props} notification={this.handleNotification}/> } />
                                </Switch>
                            </Segment>
                        </Grid.Column>

                        <Notification id='notification' 
                                      classes={classes}
                                      color={color}
                                      notification={notification} />
                    </Grid.Row>
                </Grid>
            </Container>
        )
    }
}

export default withRouter(AdminPanel);