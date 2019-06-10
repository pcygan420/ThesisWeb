import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import { Route,Switch,withRouter } from 'react-router-dom';

/* COMPONENTS */
import AddSong from './Forms/AddSong/AddSong.js'
import Base from './Base/Base.js'
import ClipForm from './Forms/Clip/Clip.js'
import EditText from './Forms/EditText/EditText.js'
import EditTranslation from './Forms/EditTranslation/EditTranslation.js'
import Information from './Information/Information.js'
import Login from './Forms/Login/Login.js'
import Main from './Main/Main.js'
import MetricForm from './Forms/Metric/Metric.js'
import Profil from './Profil/Profil.js'
import Ranking from './Ranking/Ranking.js'
import Recommender from './Recommender/Recommender.js'
import Register from './Forms/Register/Register.js'
import Search from './Search/Search.js';
import Song from './Song/Song.js'

import Navbar from '../../components/NavBar/NavBar.js';
import Footer from '../../components/Footer/Footer.js';

import $ from "jquery";
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

class Website extends Component {

    state = {
        isAuthenticated: false
    }

    componentWillMount() {
        document.body.style.overflow = "auto"
        var token = localStorage.getItem('token');
        $('#responsive-menu').removeClass('Open');
        
        this.setState({ isAuthenticated: token !== null, activeClass: $('#responsive-menu').hasClass('Open') })
    }

    setToAuthenticated = () => {
        this.setState({ isAuthenticated: true })
    }

    render() {

        return(
            <Container fluid style={{ maxWidth: '1920px', height: '100%', padding: '0' }}>
                <Navbar auth={this.state.isAuthenticated} />

                <Switch>
                    <Route exact path='/' component={Main} />
                    <Route path='/konto/logowanie' 
                           exact 
                           render={(props) => <Login {...props} onAuth={this.setToAuthenticated} /> } />     
                    <Route path='/konto/rejestracja' exact component={Register} />          
                    <Route path='/piosenka/:title/:id' exact component={Song} />
                    <Route path='/baza' exact component={Base} />
                    <Route path='/ranking' exact component={Ranking} />
                    <Route path='/szukaj/:search' component={Search} />
                    <Route path='/dodaj-piosenke' component={AddSong} />
                    <Route path='/piosenka/:title/:id/edycja-tekstu' component={EditText}/>
                    <Route path='/piosenka/:title/:id/edycja-tłumaczenia' component={EditTranslation}/>
                    <Route path='/piosenka/:title/:id/edycja-linku' component={ClipForm} />
                    <Route path='/piosenka/:title/:id/edycja-metryki' component={MetricForm} />
                    <Route path='/profil/:user?' component={Profil}/>
                    <Route path='/informacje' component={Information} />
                    <Route path='/rekomender' component={Recommender} />
                </Switch>

                <Footer />
            </Container>
        )
    }
}

export default withRouter(Website);