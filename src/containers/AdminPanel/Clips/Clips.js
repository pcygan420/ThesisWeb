import _ from 'lodash'
import React, { Component } from 'react';
import { Header,
         Table,
         Pagination,
         Icon,
         Button,
         Segment,
         Dropdown,
         Loader } from 'semantic-ui-react';

import { get, post, remove } from '../../../api/api.js'

/* STYLES */
import './Clip.css'

class Clip extends Component {

    state = {
        activePage: 1,
        totalPages: 1,
        clips: [],
        column: null,
        direction: null,
        chosenOption: 10,
        isLoading: true
    }

    componentWillMount() { 
        
        this.loadData();
        this.setState({ isLoading: false })
    }

    loadData = () => {
        get('/Admin/GetClips/' + this.state.activePage + '/' + this.state.chosenOption).then(data => {
            this.setState({ clips: data.Texts, totalPages: (data.Total/this.state.chosenOption) })
        })
    }

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

    onPaginationArrowClickHandler = (index) => {
        let actPage = this.state.activePage;
        actPage = actPage + index;
        
        var elementsNumber = Object.keys(this.state.clips).length;
        var pages = Math.ceil(elementsNumber/5);
        if(actPage < 1 || actPage > pages)
            return;

        this.setState({ activePage: actPage })
    }

    dropdownValueHandler = (e, { value }) => this.setState({chosenOption:value})
    
    onDropdownChange = (e,data) => {
        var option = null;
        for(let i = 0; i < data.options.length; i++) {
            if(data.options[i].value === data.value)
                option = data.options[i]
       }

       switch(option.value) {
           case 1:
            this.onApproveButtonHandler(option.id);
            break;
        
           case 2:
            this.onDeleteButtonHandler(option.id);
            break;

           default:
            return;
       }
    }

    onApproveButtonHandler = (id) => {

        post('/Admin/ApproveClip/' + id, {}).then(response => {
            this.loadData();
            this.props.notification('Accept')
        })
    }

    onDeleteButtonHandler = (id) => {

        remove('/Admin/DeleteClip/' + id).then(response => {
            this.loadData();
            this.props.notification('Delete')
        })
    }

    onEditClickHandler = (e,id) => {
        this.props.history.push({ pathname: '/admin/added-songs/song/' + id,
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

    onRefreshHandle = () => {
        this.componentWillMount();
    }

    render() {

        const { clips,isLoading,activePage,totalPages,chosenOption,column,direction } = this.state;

        let startIndex = (activePage - 1) * chosenOption;
        let endIndex = activePage * chosenOption;

        return(
            <div>
                <Header as='h3' 
                        dividing > Dodane odnośniki <div className='refresh-wrapper' onClick={this.onRefreshHandle}> <Icon name='refresh' /> Odśwież </div>
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
                                <Table.HeaderCell width={2}
                                                  sorted={column === 'User' ? direction : null}
                                                  onClick={this.handleSort('User')}> Nazwa użytkownika
                                </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Wykonawca </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Tytuł </Table.HeaderCell>
                                <Table.HeaderCell width={3}> Url </Table.HeaderCell>
                                <Table.HeaderCell width={2}
                                                  sorted={column === 'AddDate' ? direction : null}
                                                  onClick={this.handleSort('AddDate')}> Data dodania
                                </Table.HeaderCell>
                                <Table.HeaderCell width={2}> Akcje </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        { isLoading ? <Table.Row><Table.Cell colSpan='6'><Loader active inline='centered' /></Table.Cell></Table.Row> : 
                            

                                    clips.length === 0 ? <Table.Row className='no-results-message'
                                                                      style={{ textAlign: 'center', height: '70px' }} >
                                                                <Table.Cell colSpan="6">
                                                                    Brak dodanych odnośników
                                                                </Table.Cell>
                                                            </Table.Row> : Object.entries(clips).slice(startIndex,endIndex).map( ([key,value],i) => {

                                    return <Table.Row key={key}>
                                                <Table.Cell>{value.Id}</Table.Cell>
                                                <Table.Cell style={{ fontSize: '14px', 
                                                                    fontWeight: 'bold', 
                                                                    color: '#1a69a4'}}>
                                                            {value.User}
                                                </Table.Cell>
                                                <Table.Cell style={{ color: '#1a69a4'}}>{value.Performer}</Table.Cell>
                                                <Table.Cell style={{ color: '#1a69a4'}}>{value.Title}</Table.Cell>
                                                <Table.Cell>{value.ClipUrl}</Table.Cell>
                                                <Table.Cell>{value.AddDate}</Table.Cell>
                                                <Table.Cell> <Dropdown id={value.id} 
                                                                       onChange={this.onDropdownChange} 
                                                                       search 
                                                                       selection 
                                                                       placeholder='Akcje' 
                                                                       options={[{key: 1,value: 1,text: 'Zatwierdź', id: value.Id },
                                                                                {key: 2,value: 2,text: 'Odrzuć', id: value.Id }]}/> </Table.Cell>
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

export default Clip;