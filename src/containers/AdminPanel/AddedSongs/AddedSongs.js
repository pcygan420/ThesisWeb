import _ from 'lodash'
import React, { Component } from 'react';
import { Header,
         Table,
         Pagination,
         Icon,
         Button,
         Segment } from 'semantic-ui-react';
         
import { withRouter } from 'react-router'
import { get } from '../../../api/api.js'

/* COMPONENTS */
import Loader from '../../../components/Loaders/AdminLoader/AdminLoader.js'

class AddedTexts extends Component {

    state = {
        activePage: 1,
        totalPages: 1,
        songs: [],
        column: null,
        direction: null,
        chosenOption: 10,
        isLoading: true
    }

    handlePaginationChange = (e, { activePage }) => {
        
        this.setState({ activePage })
        this.props.history.push({
            pathname: '/admin/added-texts',
            search: '?number=' + this.state.chosenOption + '&activePage=' + this.state.activePage,
            state: { activePage: this.state.activePage,
                     chosenOption: this.state.chosenOption}
          })
    }

    onEditClickHandler = (e,id) => {
        this.props.history.push({ pathname: '/admin/dodane-piosenki/' + id,
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

    componentWillMount() { 
        
        get('/Song/GetAddedSongs/' + this.state.activePage + '/' + this.state.chosenOption).then(data => {
            this.setState({ songs: data.Songs, 
                            totalPages: (data.Total/this.state.chosenOption),
                            isLoading: false })
        })
    }

    onRefreshHandle = () => {
        this.componentWillMount();
    }

    render() {

        const { songs, totalPages, activePage, isLoading, column, direction } = this.state;

        let startIndex = (this.state.activePage - 1) * this.state.chosenOption;
        let endIndex = this.state.activePage * this.state.chosenOption;

        return(
            
            <div>      
                <Header as='h3' 
                        dividing> Dodane piosenki <div className='refresh-wrapper' onClick={this.onRefreshHandle}> <Icon name='refresh' /> Odśwież </div>
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
                                <Table.HeaderCell width={1}> ID </Table.HeaderCell>
                                <Table.HeaderCell width={3}
                                                  sorted={column === 'User' ? direction : null}
                                                  onClick={this.handleSort('User')} > Nazwa użytkownika
                                </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Wykonawca </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Tytuł </Table.HeaderCell>
                                <Table.HeaderCell width={3}
                                                  sorted={column === 'AddDate' ? direction : null}
                                                  onClick={this.handleSort('AddDate')} > Data dodania 
                                </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Akcje </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        { isLoading ? <Table.Row><Table.Cell colSpan='6' style={{ height: '41px' }}> <Loader /> </Table.Cell></Table.Row> : 
                                    
                                                       
                                          songs.length === 0 ? <Table.Row className='no-results-message'
                                                                          style={{ textAlign: 'center', height: '70px' }} >
                                                                    <Table.Cell colspan="6">
                                                                        Brak dodanych piosenek
                                                                    </Table.Cell>
                                                               </Table.Row> : Object.entries(songs).slice(startIndex,endIndex).map( ([key,value],i) => {

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
                                                        <Table.Cell className='option-link'
                                                                    onClick={(e) => this.onEditClickHandler(e,value.AddedSongId)}> <Icon name='pencil' /> Edytuj                                
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

export default withRouter(AddedTexts);