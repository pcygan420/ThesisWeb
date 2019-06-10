import _ from 'lodash'
import React, { Component } from 'react';
import { Header,
         Table,
         Pagination,
         Icon,
         Button,
         Segment,
         Loader } from 'semantic-ui-react';
         
import { withRouter } from 'react-router'
import { get } from '../../../api/api.js'

class Metrics extends Component {

    state = {
        activePage: 1,
        totalPages: 1,
        metrics: [],
        column: null,
        direction: null,
        chosenOption: 10,
        isLoading: true
    }

    handlePaginationChange = (e, { activePage }) => {
        
        this.setState({ activePage })
        this.props.history.push({
            pathname: '/admin/added-metrics',
            search: '?number=' + this.state.chosenOption + '&activePage=' + this.state.activePage,
            state: { activePage: this.state.activePage,
                     chosenOption: this.state.chosenOption}
          })
    }

    onEditClickHandler = (e,id) => {
        this.props.history.push({ pathname: '/admin/metryki/' + id,
                                      state: { id: id } })
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

        get('/Admin/GetMetrics/' + this.state.activePage + '/' + this.state.chosenOption).then(data => {
            this.setState({ metrics: data.Metrics, 
                            totalPages: (data.Total/this.state.chosenOption),
                            isLoading: false })
        })
    }

    onRefreshHandle = () => {
        this.componentWillMount();
    }

    render() {

        const { metrics,isLoading,activePage,totalPages,chosenOption,column,direction } = this.state;  

        let startIndex = (activePage - 1) * chosenOption;
        let endIndex = activePage * chosenOption;
 

        return(
            <div>
                <Header as='h3' 
                        dividing >
                    Metryki <div className='refresh-wrapper' onClick={this.onRefreshHandle}> <Icon name='refresh' /> Odśwież </div>
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
                                <Table.HeaderCell width={3}> Nazwa użytkownika </Table.HeaderCell>
                                <Table.HeaderCell width={3}
                                                  sorted={column === 'User' ? direction : null}
                                                  onClick={this.handleSort('User')}> Wykonawca
                                </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Tytuł </Table.HeaderCell>
                                <Table.HeaderCell width={3}
                                                  sorted={column === 'AddDate' ? direction : null}
                                                  onClick={this.handleSort('AddDate')}> Data dodania
                                </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Akcje </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        { isLoading ? <Table.Row><Table.Cell colSpan='6'><Loader active inline='centered' /></Table.Cell></Table.Row> : 
                            

                                metrics.length === 0 ? <Table.Row className='no-results-message'
                                                                    style={{ textAlign: 'center', height: '70px' }} >
                                                                <Table.Cell colSpan="6">
                                                                    Brak poprawionych metryk
                                                                </Table.Cell>
                                                            </Table.Row> : Object.entries(this.state.metrics).slice(startIndex,endIndex).map( ([key,value],i) => {

                                    return <Table.Row key={key}>
                                                <Table.Cell>{value.MetricId}</Table.Cell>
                                                <Table.Cell style={{ fontSize: '14px', 
                                                                     fontWeight: 'bold', 
                                                                     color: '#1a69a4'}}>
                                                            {value.User}
                                                </Table.Cell>
                                                <Table.Cell style={{ color: '#1a69a4'}}>{value.Performer}</Table.Cell>
                                                <Table.Cell style={{ color: '#1a69a4'}}>{value.Title}</Table.Cell>

                                                <Table.Cell>{value.AddDate}</Table.Cell>
                                                <Table.Cell className='option-link'
                                                            onClick={(e) => this.onEditClickHandler(e,value.MetricId)}> <Icon name='pencil' /> Edytuj 
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

export default withRouter(Metrics);