import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom'

import { Container,
         Dimmer,
         Grid,
         Header,
         Icon,
         Image,
         List,
         Loader,
         Rating,
         Segment,
         Statistic } from 'semantic-ui-react';

import { get,post } from '../../../api/api.js'

/* STYLES */
import './Song.css';
import placeholder from '../../../assets/Images/avatar.png';

/* COMPONENTS */
import Comments from '../../../components/Comments/Comments.js';
import MyLoader from '../../../components/Loaders/Loader.js'

class Song extends Component {

    state = {
        song: { Actions: [] },
        isAuthenticated: false,
        isDataLoading: true,
        rateAdding: false,
        heartAdding: false,
        rating: 0,
        heartAdded: false,
        telediskAddShow: false
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.id !== this.props.match.params.id) 
            window.location.reload();
        
    }

    componentWillMount() {

        get('/Song/GetFullSong/' + this.props.match.params.id).then(data => {
            
            this.setState({ song: data, 
                            isDataLoading: false,
                            isAuthenticated: localStorage.getItem('token') !== null,
                            rating: data.UserRating ? data.UserRating : 0,
                            heartAdded: data.UserFavourite })
        })
    }

    checkAuthentication() {
        if(!this.state.isAuthenticated) 
            return false
        else
            return true
    }

    Actions = (element) => {

        switch(element.Status) {
            case 0:
                return "Dodał tekst " + element.AddDate;
            case 1:
                return "Dodał tłumaczenie " + element.AddDate;
            case 2:
                return "Dodał teledysk " + element.AddDate;
            case 3:
                return "Poprawił tekst " + element.AddDate;
            case 4:
                return "Poprawił tłumaczenie " + element.AddDate;
            case 5:
                return "Poprawił metrykę " + element.AddDate;
            default:
                return;
        }
    }

    onAddTranslationExpectant = () => {

        if(!this.checkAuthentication())
            return this.props.history.push('/konto/logowanie')

        const { song,isAuthenticated } = this.state;

        if(song.IsUserExpecting || !isAuthenticated)
            return;

        post('/Song/AddExpectant/' + song.EntityId,{}).then(response => {
            const updatedSong = this.state.song;
            updatedSong.IsUserExpecting = true;
            updatedSong.TotalExpectants = updatedSong.TotalExpectants + 1

            this.setState({ song: updatedSong })
        })
    }

    handleRate = (e, { rating, maxRating }) => {

        if(!this.checkAuthentication())
            return this.props.history.push('/konto/logowanie')
        
        const { song, rateAdding } = this.state;

        if(rateAdding)
            return;

        var obj = {
            EntityId: song.EntityId,
            Performer: song.Performer,
            Title: song.Title,
            Rate: rating
        }

        this.setState({ rateAdding: true })

        post('/Song/AddRate', obj).then(response => {

            this.setState({ rating: rating,
                            rateAdding: false })
        })      
    }

    ToggleHeartRate = () => {

        if(!this.checkAuthentication())
            return this.props.history.push('/konto/logowanie')

        const { song,heartAdding } = this.state;

        if(heartAdding)
            return;

        let heartValue = this.state.heartAdded;
        this.setState({heartAdding: true})

        post('/Song/AddHeart/' + song.EntityId).then(response => {
            
            this.setState({ heartAdded: !heartValue,
                            heartAdding: false })
        })
    }

    render() {

        const { song,isDataLoading,rateAdding,rating,heartAdded,heartAdding,isAuthenticated } = this.state;
        let textUser = ''
        let tranUser = ''
        let linkUser = ''
   
        let clip = (song.TelediskUrl ? song.TelediskUrl.replace('watch?v=','embed/') : null )

        if(song.Actions.length !== 0) {
            if(song.Actions.length !== 0) {
                textUser = song.Actions.find(u => u.Status === 0).User;
                tranUser = (song.Translation !== null ? song.Actions.find(u => u.Status === 1).User : null);
                linkUser = (song.TelediskUrl !== null ? song.Actions.find(u => u.Status === 2).User : null);
            }
        }

        return(
            <Container fluid style={{maxWidth: '1920px' }}>
                <div className="song-wrapper">
                    {   isDataLoading ? <MyLoader />  :
                        <Grid>                           
                            <Grid.Row style={{ margin: '0' }}>
                                <Grid.Column mobile={16} style={{ margin: '50px 0 25px 0'}}>
                                    <Header className='title-header'
                                            as='h1'
                                            style={{ fontFamily: 'Merriweather, serif' }}>
                                        { song.Performer } - { song.Title }
                                    </Header>
                                </Grid.Column>

                                <Grid.Column mobile={16}
                                             tablet={10}
                                             computer={8}
                                             floated='right'>
                                    
                                    <div className="teledisk">
                                        <div className='clip-div'>
                                            <iframe title='teledisk' 
                                                    src={clip}>
                                            </iframe>
                                        </div>
                                    </div>
                                    
                                </Grid.Column>                    
                                
                                <Grid.Column computer={16} style={{ position: 'relative',  }}>
                                    <Grid>
                                        <Grid.Row style={{ position: 'relative', height: '100%', paddingBottom: '0' }}>                         
                                            <Grid.Column className='left-column'
                                                        mobile={16} 
                                                        tablet={8}
                                                        computer={8}>

                                                <Segment className='users-list-wrapper'>
                                                    <List>
                                                        <List.Item as='a'>
                                                            <Icon name='user' style={{ fontSize: '10px' }} />
                                                            <List.Content>
                                                                <List.Header> 
                                                                    Tekst dodał: <span style={{ color: '#2185d0' }}> { textUser } </span>
                                                                    <NavLink className={isAuthenticated ? null : 'disabled-link'}
                                                                                to={{ pathname: '/piosenka/' + song.Title +  '/' + song.EntityId + '/edycja-tekstu',
                                                                                state: { title: song.Title,
                                                                                        performer: song.Performer,
                                                                                        text: song.Text } }}
                                                                                style={{ float: 'right' }}> Edytuj tekst 
                                                                    </NavLink>
                                                                </List.Header>
                                                            </List.Content>
                                                        </List.Item>
                                                        <List.Item as='a'>
                                                            <Icon name='user' style={{ fontSize: '10px' }} />
                                                            <List.Content>
                                                                <List.Header> 
                                                                    Tłumaczenie dodał: <span style={{ color: '#2185d0' }}> { tranUser} </span>
                                                                    <NavLink className={isAuthenticated ? null : 'disabled-link'}
                                                                                to={{ pathname: '/piosenka/' + song.Title +  '/' + song.EntityId + '/edycja-tłumaczenia',
                                                                                state: { title: song.Title,
                                                                                        performer: song.Performer,
                                                                                        text: song.Text,
                                                                                        translation: song.Translation } }}
                                                                                style={{ float: 'right' }}> Edytuj tłumaczenie 
                                                                    </NavLink>
                                                                </List.Header>
                                                            </List.Content>
                                                        </List.Item>
                                                        <List.Item as='a'>
                                                            <Icon name='user' style={{ fontSize: '10px' }} />
                                                            <List.Content>
                                                                <List.Header> 
                                                                    Teledysk dodał: <span style={{ color: '#2185d0' }}> { linkUser } </span>
                                                                    <NavLink className={isAuthenticated ? null : 'disabled-link'}
                                                                                to={{ pathname: '/piosenka/' + song.Title +  '/' + song.EntityId + '/edycja-linku',
                                                                                state: { title: song.Title,
                                                                                        performer: song.Performer,
                                                                                        url: song.TelediskUrl } }}
                                                                                style={{ float: 'right' }}> Edytuj link
                                                                    </NavLink>
                                                                </List.Header>
                                                            </List.Content>
                                                        </List.Item>
                                                    </List>
                                                </Segment>
                                            </Grid.Column>

                                            <Grid.Column className='right-column'
                                                         mobile={16} 
                                                         tablet={8}
                                                         computer={8}>

                                                    <Segment className='rate-segment'>
                                                        <Statistic.Group size='mini'>
                                                            <Statistic color='blue'>                            
                                                                <Statistic.Value>
                                                                    <Icon name='star' /> {song.RateAvg.toFixed(1)}/5
                                                                </Statistic.Value>
                                                                <Statistic.Label>Średnia ocen</Statistic.Label>
                                                            </Statistic>

                                                            <Statistic color='blue'>                            
                                                                <Statistic.Value>
                                                                    <Icon name='user' /> {song.RatesTotal}
                                                                </Statistic.Value>
                                                                <Statistic.Label>Ocen użytkowników</Statistic.Label>
                                                            </Statistic>

                                                            <Statistic>                            
                                                                <Statistic.Value className='rate-user'>
                                                                    <List.Content> 
                                                                        { (rateAdding || heartAdding ) ?  <Dimmer active inverted style={{  }}> 
                                                                                                <Loader active
                                                                                                        size='small' />
                                                                                        </Dimmer> : null}
                                                                        <Rating icon='star'
                                                                                maxRating={5}
                                                                                rating={rating}
                                                                                onRate={this.handleRate} />   

                                                                        <Rating className='favourite-icon'
                                                                                icon='heart' 
                                                                                corner='top right'
                                                                                maxRating={1}
                                                                                rating={heartAdded ? 1 : 0}
                                                                                onRate={this.ToggleHeartRate} />  

                                                                    </List.Content>
                                                                </Statistic.Value>
                                                                <Statistic.Label> Twoja ocena </Statistic.Label>
                                                            </Statistic>
                                                        </Statistic.Group>
                                                    </Segment>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>  

                                <Grid.Column mobile={16} style={{  }}>
                                    <Grid>
                                        <Grid.Row style={{ paddingTop: '0' }}>

                                            <Grid.Column mobile={8} computer={8} style={{ marginTop: '15px', padding: '0 0.5em 0 0' }}>
                                                <div className="song-text">
                                                    <Header as='h3'
                                                            color='grey'> Tekst:
                                                    </Header>
                                                    <div>
                                                        { song.Text }
                                                    </div>
                                                </div>
                                            </Grid.Column>
                                            <Grid.Column mobile={8} style={{ padding: '0 0 0 0.5em', marginTop: '15px' }}>
                                                <div className="song-text">
                                                    <Header as='h3'
                                                            color='grey'> Tłumaczenie:
                                                    </Header>
                                                    <div>
                                                        { song.Translation !== null ? song.Translation : 
                                                                                    <Header as='h4' 
                                                                                            className='my-link'
                                                                                            onClick={this.onAddTranslationExpectant}>

                                                                                        <Icon name='add user'
                                                                                                color='blue'
                                                                                                size='small' />
                                                                                        <Header.Content>
                                                                                                { this.state.isAuthenticated ? 
                                                                                                    (song.IsUserExpecting ? 'Oczekujesz tłumaczenia.' : 'Dołącz do oczekujących') : 
                                                                                                    ('Zaloguj się by dołączyć do oczekujących')
                                                                                                }                                                      
                                                                                            <Header.Subheader> { song.TotalExpectants } osób oczekuję tłumacznia</Header.Subheader>    
                                                                                        </Header.Content>
                                                                                    </Header>
                                                        }
                                                    </div>                   
                                                </div>      
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>

                                <Grid.Column mobile={16}>
                                    <div className="other-songs">
                                        <Header as='h3' 
                                                color='grey'
                                                style={{ margin: '15px 0 0 0' }}>
                                            Historia zmian tekstu:
                                        </Header>
                                        <div className='song-edit-history-wrapper' style={{ height: this.state.height }}>
                                            <List>

                                                { song.Actions.map( (elem,i) => {
                                                    return(
                                                        <List.Item key={i} style={{ padding: '5px 0px', fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif' }}>
                                                            <Image avatar src={placeholder} style={{ borderRadius: '0' }} />
                                                            <List.Content>
                                                                <List.Header as='a'>{elem.User}</List.Header>
                                                                <List.Description>
                                                                    { this.Actions(elem) }
                                                                </List.Description>
                                                            </List.Content>
                                                        </List.Item>
                                                    )
                                                })}
                                                
                                            </List>
                                        </div>
                                    </div>
                                </Grid.Column>         

                                <Grid.Column mobile={16}>
                
                                    <Segment style={{ boxShadow: 'none', marginBottom: '10px', width: '100%' }} >
                                            
                                        <List className='metric-list'>
                                            <List.Item as='a'>
                                                <Icon name='info' />
                                                <List.Content>
                                                    <List.Header>Wykonanie</List.Header>
                                                    <List.Description>
                                                        {song.Performer}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item as='a'>
                                                <Icon name='info' />
                                                <List.Content>
                                                    <List.Header>Album</List.Header>
                                                    <List.Description>
                                                        {song.Album}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item as='a'>
                                                <Icon name='info' />
                                                <List.Content>
                                                    <List.Header>Rok wydania</List.Header>
                                                    <List.Description>
                                                        {song.PublicationDate}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item as='a'>
                                                <Icon name='info' />
                                                <List.Content>
                                                    <List.Header>Długość</List.Header>
                                                    <List.Description>
                                                        {song.Duration}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item as='a'>
                                                <Icon name='info' />
                                                <List.Content>
                                                    <List.Header>Gatunki</List.Header>
                                                    <List.Description>
                                                        {song.Tags}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                            <List.Item as='a'>
                                                <Icon name='info' />
                                                <List.Content>
                                                    <List.Header>Ciekawostki</List.Header>
                                                    <List.Description>
                                                        {song.Curiosities}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                        
                                    </Segment>
                                    
                                    <NavLink className={isAuthenticated ? null : 'disabled-link'}
                                                to={'/piosenka/' + song.Title +  '/' + song.EntityId + '/edycja-metryki'}> Edytuj metrykę 
                                    </NavLink>

                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column mobile={16}>
                                    <Comments authenticated={isAuthenticated}
                                                         entity={song.EntityId} 
                                                         comments={song.Comments} />
                                </Grid.Column>
                            </Grid.Row>  
                    </Grid> 
                    }
                </div>

            </Container>
        )
    }
}

export default withRouter(Song);