import _ from 'lodash'
import React, { Component } from 'react';
import { Button,
         Form,
         Icon,
         Image,
         Search } from 'semantic-ui-react';

import { withRouter,NavLink } from 'react-router-dom';
import { get, logout } from '../../api/api.js'

import $ from "jquery";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

/* Styles */
import './NavBar.css'

/* Components */
import MenuDropdown from './MenuDropdown/MenuDropdown.js'

class NavBar extends Component {

  state = {
    isAuthenticated: false,
    results: [],
    isLoading: false,
    activeClass: false,
    value: '',
    searchMessage: 'Brak wyników.'
  };

  componentWillReceiveProps() {
    if (this.props.auth) {
      this.setState({ isAuthenticated: true });
    }
    return true;
  }

  componentDidMount() {
    this.setState({ isAuthenticated: this.props.auth })
    document.getElementsByClassName("app-dimmer")[0].style.display = "none";
  }

  toggleClass = () => {

      var body = document.body.style.overflow;
      if(body === "hidden") {
        document.body.style.overflow = "auto"
        document.getElementsByClassName("app-dimmer")[0].style.display = "none";
        this.setState({ activeClass: false })
        $('#responsive-menu').removeClass('Open');
      }
      else {
        document.body.style.overflow = "hidden"
        document.getElementsByClassName("app-dimmer")[0].style.display = "block";
        this.setState({ activeClass: true })
        $('#responsive-menu').addClass('Open');
      }
  };

  onLogoutHandler = () => {
    logout();
    this.props.history.push('/')
    window.location.reload();
  }

  resetComponent = () => this.setState({ isLoading: false, results: [] })

  onResultSelectHandler = (e, { result }) => {
    
    this.props.history.push('/piosenka/' + result.title + '/' + result.id)
  }

  handleSearchChange = (e, { value }) => {

    if(value.leading === 0)
    {
      this.setState({ isLoading: false, results: [], value: '' })
      return;
    }

    this.setState({ isLoading: true,value: value })

    /* search only when fraze is longer than 1 character */
    if(value.length < 2) {
      this.setState({ searchMessage: 'Zbyt krótka fraza.' })
      return this.resetComponent();
    }

    this.setState({ searchMessage: 'Brak wyników.' })

    setTimeout(() => {

      get('/Song/Search/' + value).then(data => {
        
        this.setState({
          isLoading: false,
          results: data,
        })
      })    
      
    }, 300)
  }

  onSearchSubmit = () => {
    this.props.history.push('/szukaj/' + this.state.value)
  }

  render() {
    
    const { isLoading,
            results,
            value,
            isAuthenticated,
            activeClass,
            searchMessage } = this.state;

    return (
      <div className="navbar">
        <div className="navbar-content">
          <div className="nav-header"> 
            <div className="nav-logo-wrapper"> 
              <NavLink to="/" exact> Praca inżynierska </NavLink> 
            </div>

            <div className="search-box-wrapper">
              <div>
                <Form onSubmit={this.onSearchSubmit}>
                  <Search className='search-box'
                          icon='search'
                          loading={isLoading}
                          placeholder='Szukaj piosenek'
                          results={results}
                          noResultsMessage={searchMessage}
                          value={value}
                          onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                          onResultSelect={this.onResultSelectHandler} />
                </Form>
              </div> 
            </div>

            <div className="account-wrapper"> 

              <a className="responsive-bars-icon" href="#">
                <Icon name={ activeClass ? 'window close' : 'bars' } 
                      onClick={this.toggleClass} />          
              </a> 

              <div id="responsive-menu">
                <div className="account-header">
                  { 
                    isAuthenticated ?  (  activeClass ? <div className='log-in-user'>    
                                                          <a href="#"> 
                                                            <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' 
                                                                    avatar 
                                                                    size='mini'
                                                                    style={{ margin: '0 15px' }}/> 
                                                              {localStorage.getItem('userName')} 
                                                            <Icon name='x'
                                                                  size='big'
                                                                  style={{ color: 'white', float: 'right', lineHeight: '60px' }}
                                                                  onClick={this.toggleClass} />
                                                          </a>
                                                        </div> : 
                                                          <MenuDropdown logout={this.onLogoutHandler} /> ) :
                    ( 
                      <div>
                        <a href="#">
                          <Icon name='x'
                                size='big'
                                style={{ color: 'white' }}
                                onClick={this.toggleClass} />
                        </a>
                        <NavLink to="/konto/logowanie" exact> 
                          <Button inverted >
                                  <Icon name='sign-in' /> Zaloguj się
                          </Button>
                        </NavLink>
                        <NavLink to="/konto/rejestracja" exact> 
                          <Button className='account-button'
                                  color="blue"> 
                                  <Icon name='magic' /> Rejestracja
                          </Button>
                        </NavLink>
                      </div>
                    )             
                  }
                </div>

                <div className="list-wrapper">
                  <ul>   
                    <li className='nav-list-link'> <NavLink to="/">Główna</NavLink> </li>
                    <li className='nav-list-link'> <NavLink to="/baza">Baza</NavLink> </li>      
                    <li className='nav-list-link'> <NavLink to="/ranking">Ranking</NavLink> </li>   
                    <li className='nav-list-link'> <NavLink to={ isAuthenticated ? '/dodaj-piosenke' : '/konto/logowanie'}>Dodaj piosenkę</NavLink> </li>

                    <div className="ui hidden divider"></div>

                    { isAuthenticated ? <li className='nav-list-link'> <NavLink to='/profil'>Mój profil</NavLink> </li> : null }
                    { isAuthenticated && activeClass ? ( <div>
                                                          <li className='nav-list-link'> 
                                                            <NavLink to=' ' onClick={this.onLogoutHandler}> Wyloguj się </NavLink> 
                                                          </li>
                                                         </div>
                                                        ) : null}
                    <li className='recommender-link'> <NavLink to="/rekomender">Rekomender</NavLink> </li>
                  </ul>
                </div>

              </div>    
            </div>          
          </div>  
        </div>        
      </div>
    );
  }
}

export default withRouter(NavBar);