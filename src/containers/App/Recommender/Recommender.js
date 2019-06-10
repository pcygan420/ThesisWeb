import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button,
         Container,
         Grid,
         Header } from 'semantic-ui-react';

import { get,post } from '../../../api/api.js'

/* STYLES */
import './Recommender.css'

/* COMPONENTS */
import RecommendCard from '../../../components/Cards/RecommendCard/RecommendCard.js'
import Loader from '../../../components/Loaders/Loader.js'

class Recommender extends Component {

    state = {
        isLoading: true,
        songs: [],
        activePage: 1,
        totalPages: 1,
        isAuthenticated: false,
        message: null
    }

    componentWillMount() {

        var isAuthenticated = localStorage.getItem('token') !== null;

        if(!isAuthenticated)
            return;

        this.setState({ isAuthenticated: true })
            
        get('/Recommender/Get/' + this.state.activePage).then(data => {
            
            if(!data.Message) {

                let array = data.sort((a,b) => (a.PredictedRate < b.PredictedRate) ? 1 : ((b.PredictedRate < a.PredictedRate) ? -1 : 0)); 
                
                this.setState({ songs: array,
                                totalPages: Math.ceil(data.length/5) });
                                
            } else {
                this.setState({ message: data.Message })
            }

            this.setState({ isLoading: false })
        })
    }

    checkAuthentication() {
        if(!this.state.isAuthenticated) 
            return false
        else
            return true
    }

    handleRate = (id,rating,title,performer) => {
        
        if(!this.checkAuthentication())
            return this.props.history.push('/konto/logowanie')
        
        var obj = {
            EntityId: id,
            Rate: rating,
            Title: title,
            Performer: performer
        }

        post('/Song/AddRate', obj).then(response => {
        })
    }

    onHandlePageChange = (e,{ activePage }) => {
        e.preventDefault();

        this.setState({ activePage })
        this.setState({ searchLoading: true })

        get('/Song/GetSongs/' + activePage).then(data => {
            this.setState({ result: data.Results, searchLoading: false })
        })
    }

    loginHandler = () => {
        this.props.history.push('/konto/logowanie')
    }

    render() {

        const { isLoading,
                songs,
                activePage,
                isAuthenticated,
                message } = this.state;

        return(
            <Container fluid
                       style={{ minWidth: '925px', maxWidth: '1920px', padding: '0'}}>

                <div className='recommender-wrapper'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16}>
                                <Header as='h2'
                                        content='Polecane Tobie'
                                        dividing
                                        icon='magic' />
                            </Grid.Column>

                            <Grid.Column mobile={16} className='recommended-songs-wrapper'>
                                {   
                                    isAuthenticated ? <div>
                                        {   isLoading ? <Loader /> :
                                                        <div>
                                                            {
                                                                message === null ?
                                                                songs.map( (elem,i) => {
                                                                    return <RecommendCard key={i} 
                                                                                          index={ (activePage - 1) * 10 + i + 1}
                                                                                          song={elem}
                                                                                          handleRate={this.handleRate} />
                                                                }) : <div className='recommender-message'>
                                                                        <span> {message} </span>
                                                                    </div>
                                                            }
                                                        </div>
                                        }
                                    </div> : <div style={{ textAlign: 'center', height: '100px', lineHeight: '100px' }}>
                                        
                                        <Button content='Zaloguj się by korzystać z rekomendera'
                                                color='blue'
                                                icon='sign-in'
                                                onClick={this.loginHandler} />
                                    </div>
                                }         
                            </Grid.Column>

                        </Grid.Row>
                    </Grid>
                </div>
            
            </Container>
        )
    }
}

export default withRouter(Recommender);