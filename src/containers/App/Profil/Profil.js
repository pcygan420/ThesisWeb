import React, { Component } from 'react';
import { Container,
         Grid,
         Header,
         Icon,
         Image,
         List,
         Menu, 
         Pagination,
         Segment,
         Statistic,
         Table } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom'
import { get,getToken } from '../../../api/api.js';
import axios from 'axios'

/* STYLES */
import './Profil.css';
import darkman from '../../../assets/Images/matthew.png'

/* COMPONENTS */
import MyLoader from '../../../components/Loaders/Loader.js';

class Profil extends Component {

    state = {
        user: null,
        profil: {},
        activeItem: 0,
        added: [],
        addedTotal: 0,
        addedTotalPages: 1,
        addedActivePage: 1,
        
        activeItem2: 0,
        rates: [],
        ratesTotal: 0,
        ratesTotalPages: 1,
        ratesActivePage: 1,

        isLoading: true,
        ratesLoading: true,
        profilLoading: true
    }

    componentWillMount() {

        const user = this.props.match.params.user
        if(user !== undefined)
            this.setState({ user: user })

        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + getToken()
        }

        var that = this;

        var getProfile = '/User/GetProfil';
        var getAdded = '/User/Get/1/0';
        var getRates = '/User/GetRated/1/0';

        if(user !== undefined) {
            getProfile = getProfile + '/' + user;
            getAdded = getAdded + '/' + user;
            getRates = getRates + '/' + user;
        }

        axios.all([
            axios.get(getAdded, { headers: headers }),
            axios.get(getRates, {headers: headers }),
            axios.get(getProfile, { headers: headers })
          ])
          .then(axios.spread(function (texts, rates, profil) {
            
            let rat = rates.data;
            let added = texts.data;
            let userProfil = profil.data;
            
            that.setState({ profil: userProfil,
                            added: added.Actions,
                            addedTotal: added.Total,
                            rates: rat.Rates,
                            ratesTotal: rat.Total,
                            profilLoading: false,
                            ratesLoading: false,
                            addedTotalPages: Math.ceil(added.Total/5),
                            ratesTotalPages: Math.ceil(rat.Total/5),
                            isLoading: false })
          }))
    }

    rateMenuItemChangeHandler = (number) => {
        
        if(number === this.state.activeItem2)
            return;
        
        this.setState({ ratesActivePage: 1 })
        this.getUserRates(number,1)
    }

    handlePaginationChange2 = (e, { activePage }) => {
        
        this.setState({ ratesActivePage: activePage })
        this.getUserRates(this.state.activeItem2,activePage)
    }    

    getUserRates = (number,page) => {

        this.setState({ rates: [],
                        activeItem2: number,
                        ratesLoading: true })

        var url = number === 0 ? '/User/GetRated/' : '/User/GetFavourite/';

        var optionalUser = "";

        if(this.state.user !== null)
         optionalUser = '/' + this.state.user;

        get(url + page + '/' + number + optionalUser).then(data => {
            
            this.setState({ rates: data.Rates,
                            ratesTotalPages: Math.ceil(data.Total/5),
                            ratesLoading: false })
        })     
    }

    menuItemChangeHandler = (number) => {

        if(number === this.state.activeItem) 
            return;

        this.setState({ addedActivePage: 1 })
        this.getUserActions(number,1)
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ addedActivePage: activePage })
        this.getUserActions(this.state.activeItem,activePage)
    }

    getUserActions = (number,page) => {

        this.setState({ added: [],
                        activeItem: number,
                        isLoading: true })

        var optionalUser = "";

        if(this.state.user !== null)
         optionalUser = '/' + this.state.user;

        get('/User/Get/' + page + '/' + number + optionalUser).then(data => {
            this.setState({ added: data.Actions,
                            addedTotalPages: Math.ceil(data.Total/5),
                            isLoading: false })
        })     
    }

    render() {

        const { user,
                profil, 
                added,
                activeItem,
                isLoading, 
                profilLoading, 
                addedActivePage, 
                addedTotalPages,
                
                rates,
                activeItem2,
                ratesActivePage,
                ratesTotalPages,
                ratesLoading } = this.state;

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                <div className="profil-wrapper">
                    <Grid style={{ padding: '75px 1em' }} >

                        <Header as='h2' 
                                content={ user === null ? 'Twój profil' : 'Profil użytkownika ' + user }
                                dividing />

                        <Segment className='info-segment'>  
                            <Grid style={{ minHeight: '150px' }}>
                            { 
                                profilLoading ? <MyLoader /> :
                                <Grid.Row style={{ padding: '0' }}>
                                    <Grid.Column mobile={4} computer={3} style={{ position: 'relative', textAlign: 'center' }}>
                                        <Image src={darkman} 
                                               size='medium'
                                               style={{ margin: 'auto', overflow: 'hidden', marginBottom: '5px' }} />
                                    </Grid.Column>         

                                    <Grid.Column mobile={12} computer={13}>
                                        
                                        <List className='profil-info-list' size='large'>
                                            <List.Item>
                                                <List.Header>Login: </List.Header> { user ? user : localStorage.getItem('userName')}
                                            </List.Item>
                                            <List.Item>
                                                <List.Header>Imię: </List.Header> { profil.FirstName }
                                            </List.Item>
                                            <List.Item>
                                                <List.Header>Płeć: </List.Header> { profil.Sex === 'm' ? 'Mężczyzna' : 'Kobieta' }
                                            </List.Item>
                                            <List.Item>
                                                <List.Header>{ profil.Sex === 'm' ? 'Dołączył' : 'Dołączyła' } </List.Header> { profil.JoinDate }
                                            </List.Item>
                                            <List.Item>
                                                <List.Header>Ranking: </List.Header> <span style={{ color: 'teal' }}> {profil.Rank}. </span>
                                            </List.Item>
                                            <List.Item>
                                                <List.Header>Punktów: </List.Header> <span style={{ color: 'teal' }}> {profil.Points}pkt </span>
                                            </List.Item>
                                        </List>
                                        
                                    </Grid.Column>                                          
                                </Grid.Row>
                            }
                            </Grid>
                        </Segment>
                                
                         
                        <Header as='h2'
                                content='Statystyki użytkownika'
                                dividing
                                style={{ paddingLeft: '1rem' }} />

                        <Grid.Row>
                            <Grid.Column computer={16} style={{ position: 'relative',padding: '0' }}>
         
                                <Statistic.Group className='stats'>

                                    <Statistic color='blue'>
                                        <Statistic.Value>
                                            <Icon name='star'
                                                  size='small' /> {profil.RatesTotal}
                                        </Statistic.Value>
                                        <Statistic.Label>Ocen</Statistic.Label>
                                    </Statistic>

                                    <Statistic color='red'>
                                        <Statistic.Value>
                                            <Icon name='heart'
                                                  size='small' /> {profil.FavTotal}
                                        </Statistic.Value>
                                        <Statistic.Label>Ulubionych</Statistic.Label>
                                    </Statistic>

                                    <Statistic color='teal'>
                                        <Statistic.Value>
                                            <Icon name='music'
                                                  size='small' /> {profil.SongsTotal}
                                        </Statistic.Value>
                                        <Statistic.Label>Dodanych piosenek</Statistic.Label>
                                    </Statistic>

                                    <Statistic color='teal'>
                                        <Statistic.Value>
                                            <Icon name='pencil'
                                                  size='small' /> {profil.TransTotal}
                                        </Statistic.Value>
                                        <Statistic.Label>Dodanych tłumaczeń</Statistic.Label>
                                    </Statistic>

                                    <Statistic color='teal'>
                                        <Statistic.Value>
                                            <Icon name='youtube'
                                                  size='small' /> {profil.ClipsTotal}
                                        </Statistic.Value>
                                        <Statistic.Label>Dodanych klipów</Statistic.Label>
                                    </Statistic>

                                </Statistic.Group>
                            </Grid.Column>
                            
                        </Grid.Row>     

                        <Grid.Row>
                            <Grid.Column mobile={16} className='table-column'>
                                <Menu fluid 
                                      widths={2}
                                      pointing
                                      secondary
                                      size='massive' >

                                    <Menu.Item name='Wszystkie' 
                                               active={activeItem2 === 0} 
                                               onClick={() => this.rateMenuItemChangeHandler(0)} > Oceny
                                    </Menu.Item>

                                    <Menu.Item name='Ulubione' 
                                               active={activeItem2 === 1} 
                                               onClick={() => this.rateMenuItemChangeHandler(1)} > Ulubione
                                    </Menu.Item>

                                </Menu>
                            </Grid.Column>

                            <Grid.Column className='table-column'
                                         mobile={16}
                                         style={{ minHeight: '500px' }} >

                                    <Table striped 
                                           style={{ margin: '25px auto' }}>

                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={4}> Tytuł </Table.HeaderCell>
                                                <Table.HeaderCell width={4}> Wykonawca </Table.HeaderCell>
                                                <Table.HeaderCell width={4}> Gatunki </Table.HeaderCell>
                                                <Table.HeaderCell width={4}> Ocena </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                    
                                        <Table.Body>
                                            { ratesLoading ? <Table.Row>
                                                                <Table.Cell colSpan='5' 
                                                                            style={{ height: '120px', position: 'relative' }}> 
                                                                    <MyLoader /> 
                                                                </Table.Cell>
                                                            </Table.Row> : 
                                            
                                                rates.map( (elem,i) => {
                                                    return <Table.Row key={i}>
                                                                <Table.Cell singleLine>
                                                                    <NavLink to={'/piosenka/' + elem.Title + '/' + elem.EntityId}  >{ elem.Title }</NavLink>
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    { elem.Performer }
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    { elem.Tags }
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    <Icon name='star'
                                                                          color='blue'/> { elem.Rate }/5
                                                                </Table.Cell>
                                                            </Table.Row>
                                                })
                                            }                            
                                        </Table.Body>
                                    
                                        <Table.Footer>
                                            <Table.Row>
                                                <Table.HeaderCell colSpan='8'>
                                                    <Pagination onPageChange={this.handlePaginationChange2}
                                                                activePage={ratesActivePage}
                                                                totalPages={ratesTotalPages} 
                                                                size={'mini'} />
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Footer>
                                    </Table>

                            </Grid.Column>
                        </Grid.Row>      

                        <Grid.Row style={{ marginTop: '35px' }}>
                            <Grid.Column className='table-column'
                                         mobile={16}>
                                <Menu fluid 
                                      widths={3} 
                                      pointing
                                      secondary
                                      size='massive' >

                                    <Menu.Item text='Dodane teksty' 
                                               active={activeItem === 0} 
                                               onClick={() => this.menuItemChangeHandler(0)} >Dodane teksty
                                    </Menu.Item>

                                    <Menu.Item text='Dodane tłumaczenia' 
                                               active={activeItem === 1} 
                                               onClick={() => this.menuItemChangeHandler(1)} > Dodane tlumaczenia
                                    </Menu.Item>

                                    <Menu.Item text='Dodane teledyski' 
                                               active={activeItem === 2} 
                                               onClick={() => this.menuItemChangeHandler(2)} > Dodane teledyski 
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>

                            <Grid.Column className='table-column'
                                         mobile={16}>

                                <Table striped 
                                       style={{ margin: '25px auto' }}>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width={6}> Tytuł </Table.HeaderCell>
                                            <Table.HeaderCell width={5}> Wykonawca </Table.HeaderCell>
                                            <Table.HeaderCell width={5}> Data dodania </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    
                                    <Table.Body>
                                        { isLoading ? <Table.Row>
                                                            <Table.Cell colSpan='4' 
                                                                        style={{ height: '120px', position: 'relative' }}> 
                                                                <MyLoader /> 
                                                            </Table.Cell>
                                                        </Table.Row> : 
                                        
                                            added.map( (elem,i) => {
                                                return <Table.Row key={i}>
                                                            <Table.Cell singleLine>
                                                                <NavLink to={'/piosenka/' + elem.Title + '/' + elem.Id}  >{ elem.Title }</NavLink>
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                { elem.Performer }
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                { elem.AddDate }
                                                            </Table.Cell>
                                                        </Table.Row>
                                            })
                                        }                            
                                    </Table.Body>
                                    
                                    <Table.Footer>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='8'>
                                                <Pagination onPageChange={this.handlePaginationChange}
                                                            activePage={addedActivePage}
                                                            totalPages={addedTotalPages} 
                                                            size={'mini'} />
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Footer>

                                </Table>

                            </Grid.Column>   

                        </Grid.Row>  
                    </Grid>
                </div>       

            </Container>
        )
    }
}

export default Profil;