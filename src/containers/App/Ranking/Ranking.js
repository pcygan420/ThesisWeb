import React, { Component } from 'react';
import { get } from '../../../api/api.js';

import { Container,
         Grid,
         Header,
         Pagination } from 'semantic-ui-react';

/* STYLES */
import './Ranking.css'

/* COMPONENTS */
import UserCard from '../../../components/Cards/UserCard/UserCard.js';
import Loader from '../../../components/Loaders/Loader.js';

class Ranking extends Component {

    state = {
        users: [],
        activePage: 1,
        totalPages: 1,
        isLoading: true
    }

    componentWillMount() {

        get('/User/GetUsers/' + this.state.activePage).then(data => {
            
            this.setState({ users: data.Users,
                            totalPages: data.Total/20,
                            isLoading: false })
        })
    }

    onHandlePageChange = (e,{ activePage }) => {
        e.preventDefault();

        this.setState({ activePage })
        this.setState({ isLoading: true })

        get('/User/GetUsers/' + activePage).then(data => {
            this.setState({ users: data.Users,
                            totalPages: data.Total,
                            isLoading: false })
        })
    }

    render() {

        const { users,
                activePage,
                totalPages,
                isLoading } = this.state;

        return(
            <Container fluid 
                       style={{maxWidth: '1920px', padding: '0'}}>
                       
                <div className='ranking-wrapper'>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column mobile={16} style={{ padding: '0' }}>
                                <Header as='h2'
                                        content='Ranking'
                                        dividing
                                        icon='user'/>

                                <div style={{ width: '100%', position: 'relative', minHeight: '320px' }}>
                                {
                                    isLoading ? <Loader /> :
                                                <Grid>
                                                    <Grid.Row>
                                                        {users.map( (elem,i) => {
                                                            return <Grid.Column key={i} mobile={16} tablet={8} computer={4} style={{ padding: '1rem' }}> 
                                                                        <UserCard userName={elem.UserName} 
                                                                                  about={elem.About}
                                                                                  rank={elem.Rank}
                                                                                  points={elem.Points}
                                                                                  joined={elem.Joined}/>
                                                                    </Grid.Column>
                                                        })}
                                                    </Grid.Row>
                                                </Grid>
                                }
                                </div>

                                <div className="base-pagination-wrapper">
                                    <Pagination activePage={activePage} 
                                                totalPages={totalPages} 
                                                onPageChange={this.onHandlePageChange}/>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

            </Container>
        )
    }
}

export default Ranking;