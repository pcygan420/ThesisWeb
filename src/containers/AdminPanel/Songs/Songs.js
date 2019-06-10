import _ from 'lodash'
import React, { Component } from 'react';
import { Header,
         Table,
         Icon,
         Button,
         Loader,
         Segment,
         Pagination } from 'semantic-ui-react';

import { get } from '../../../api/api.js'

class Songs extends Component {

    state = {
        activePage: 1,
        totalPages: 1,
        songs: [],
        isLoading: true,
        chosenOption: 10
    }
  
    componentWillMount() {

        get('/Song/GetSongs/' + this.state.activePage + '/' + this.state.chosenOption).then(data => {
            
            this.setState({ songs: data.Songs, 
                            totalPages: (data.Total/this.state.chosenOption),
                            isLoading: false })

            this.forceUpdate()
        })
    }

    loadData = (page) => {

        this.setState({ isLoading: true })

        get('/Song/GetSongs/' + page + '/' + this.state.chosenOption).then(data => {
            
            this.setState({ songs: data.Songs, 
                            totalPages: (data.Total/this.state.chosenOption),
                            isLoading: false })

            this.forceUpdate()
        })
    }

    onEditClickHandler = (e,id) => {
        this.props.history.push({ pathname: '/admin/piosenki/' + id,
                                  state: { id: id } 
                               })
    }

    handleSort = clickedColumn => () => {
        const { column, songs, direction } = this.state
    
        if (column !== clickedColumn) {
          this.setState({
            column: clickedColumn,
            songs: _.sortBy(songs, [clickedColumn]),
            direction: 'ascending',
          })
    
          return
        }
    
        this.setState({
            songs: songs.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    handlePaginationChange = (e, { activePage }) => {
        
        e.preventDefault();

        this.setState({ activePage })
        this.setState({ isLoading: true })

        get('/Song/GetSongs/' + activePage + '/' + this.state.chosenOption).then(data => {
            
            this.setState({ songs: data.Songs, 
                            isLoading: false })
        })
        
        this.props.history.push({
            pathname: '/admin/songs',
            search: '?number=' + this.state.chosenOption + '&activePage=' + activePage
        })
    }

    render() {

        const { songs, totalPages, activePage, isLoading } = this.state;

        return(
            <div>
                <Header as='h3' 
                        dividing >
                    Piosenki serwisu <div className='refresh-wrapper' onClick={this.onRefreshHandle}> <Icon name='refresh' /> Odśwież </div>
                </Header>

                <Segment className="filters-wrapper" vertical>
                    <Button className="filter-search-button" icon labelPosition='left' primary size='medium'>
                        <Icon name='search' /> Szukaj
                    </Button>
                </Segment>

                <Segment vertical>
                    <Table className="panel-table" 
                           sortable
                           singleLine
                           size="small" >

                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Wykonawca</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Tytuł</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Piosenka</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Tłumaczenie</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Clip</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Akcje</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        { isLoading ? <Table.Row><Table.Cell colSpan='7'><Loader active inline='centered' /></Table.Cell></Table.Row> : 
                            

                                songs.length === 0 ? <Table.Row className='no-results-message'
                                                                style={{ textAlign: 'center', height: '70px' }} >
                                                            <Table.Cell colspan="7">
                                                                Brak wyników
                                                            </Table.Cell>
                                                        </Table.Row> :   Object.entries(songs).map( ([key,value],i) => {

                                                            return <Table.Row key={key}>
                                                                        <Table.Cell>{value.EntityId}</Table.Cell>
                                                                        <Table.Cell style={{ color: '#1a69a4'}}>{value.Performer}</Table.Cell>
                                                                        <Table.Cell style={{ color: '#1a69a4'}}>{value.Title}</Table.Cell>
                                                                        <Table.Cell>{value.TextUser ? value.TextUser.User : null }</Table.Cell>
                                                                        <Table.Cell>{value.TransUser ? value.TransUser.User : null}</Table.Cell>
                                                                        <Table.Cell>{value.ClipUser ? value.ClipUser.User : null}</Table.Cell>
                                                                        <Table.Cell className='option-link'
                                                                                    onClick={(e) => this.onEditClickHandler(e,value.EntityId)}> <Icon name='pencil' /> Edytuj                                
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                        })
                                    
                        }
                        </Table.Body>
         
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan='8'>
                                    <Pagination onPageChange={this.handlePaginationChange}
                                                activePage={activePage} 
                                                totalPages={totalPages} 
                                                size={'mini'} />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Segment>
            </div>
        )
    }
}

export default Songs;