import React, { Component } from 'react';
import { Dimmer,
         Grid,
         Header,
         Message,
         Table } from 'semantic-ui-react';

import { get } from '../../../api/api.js'

/* STYLES */
import './Main.css'

/* COMPONENTS */
import PendingCard from '../../../components/Cards/PendingCard/Pending.js'
import Loader from '../../../components/Loaders/AdminLoader/AdminLoader.js'

class Main extends Component {

    state = {
        songs: [],
        totalSongs: 0,
        totalTrans: 0,
        totalClips: 0,
        totalMetrics: 0,
        isLoading: true
    }

    componentWillMount() {

        get('/Admin/Global').then(data => {
            this.setState({ songs: data.Songs,
                            totalSongs: data.TotalSongs,
                            totalTrans: data.TotalTrans,
                            totalClips: data.TotalClips,
                            totalMetrics: data.TotalMetrics,
                            isLoading: false })
        })
    }

    render() {

        const { isLoading,
                songs,
                totalSongs,
                totalTrans,
                totalClips,
                totalMetrics } = this.state;

        return(
             
            <div style={{ minHeight: '800px' }}>
            
                { isLoading ? <Dimmer active
                                      inverted> <Loader text='Wczytywanie'/> </Dimmer> :
                <Grid>
                    <Grid.Row>
                        <Message header='Informacje ogólne'
                                content='Ilość oczekujących nowych piosenek, tłumaczeń, klipów oraz metryk.' 
                                icon='info'
                                info
                                style={{ margin: '18px' }}/>

                        <Grid.Column className='pending-card-column'
                                    style={{ padding: '12px 18px' }}>

                            <PendingCard total={totalSongs}
                                         data={'dodanych piosenek'}
                                         color={'#d9534f'}
                                         icon='music'
                                         to='/admin/dodane-piosenki' />
                        </Grid.Column>

                        <Grid.Column className='pending-card-column'
                                    style={{ padding: '12px 18px' }}>

                            <PendingCard total={totalTrans}
                                        data={'dodanych tłumaczeń'}
                                        color={'#337ab7'}
                                        icon='pencil'
                                        to='/admin/dodane-tlumaczenia' />
                        </Grid.Column>

                        <Grid.Column className='pending-card-column'
                                    style={{ padding: '12px 18px' }}>

                            <PendingCard total={totalClips}
                                        data={'dodanych clipów'}
                                        color={'#f0ad4e'}
                                        icon='youtube'
                                        to='/admin/clipy' />
                        </Grid.Column>

                        <Grid.Column className='pending-card-column'
                                    style={{ padding: '12px 18px' }}>

                            <PendingCard total={totalMetrics}
                                        data={'edytowanych metryk'}
                                        color={'#5cb85c'}
                                        icon='info circle'
                                        to='/admin/metryki' />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column mobile={16}
                                    tablet={10}
                                    computer={8}>
                                    <Header as='h3' 
                                            content='Dodane piosenki'
                                            dividing />

                                    <Table  className="panel-table" 
                                            sortable
                                            singleLine
                                            size="small" >

                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell width={1}> ID </Table.HeaderCell>
                                                    <Table.HeaderCell width={3}> Nazwa użytkownika
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell width={3}> Wykonawca </Table.HeaderCell>
                                                    <Table.HeaderCell width={3}> Tytuł </Table.HeaderCell>
                                                    <Table.HeaderCell width={3}> Data dodania 
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>

                                            { isLoading ? <Table.Row><Table.Cell colSpan='6' style={{ height: '41px' }}> <Loader /> </Table.Cell></Table.Row> : 
                                                        <Table.Body>
                                                                        
                                                            { songs.length === 0 ? <Table.Row className='no-results-message'
                                                                                            style={{ textAlign: 'center', height: '70px' }} >
                                                                                        <Table.Cell colspan="6">
                                                                                            Brak dodanych piosenek
                                                                                        </Table.Cell>
                                                                                </Table.Row> : Object.entries(songs).map( ([key,value],i) => {

                                                                return <Table.Row key={key}>
                                                                            <Table.Cell>#{value.AddedSongId}</Table.Cell>
                                                                            <Table.Cell style={{ fontSize: '14px', 
                                                                                                fontWeight: 'bold', 
                                                                                                color: '#1a69a4'}}>
                                                                                        {value.User}
                                                                            </Table.Cell>
                                                                            <Table.Cell style={{ color: '#1a69a4'}}>{value.Performer}</Table.Cell>
                                                                            <Table.Cell style={{ color: '#1a69a4'}}>{value.Title}</Table.Cell>

                                                                            <Table.Cell>{value.AddDate}</Table.Cell>
                                                                        </Table.Row>
                                                            })}                     
                                                        </Table.Body>
                                            }
                                    </Table>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                }
   
            </div>
            
        )
    }

}

export default Main;