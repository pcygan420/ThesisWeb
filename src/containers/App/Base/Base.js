import React, { Component } from 'react';
import { Button,
         Checkbox,
         Container, 
         Dropdown,
         Grid,  
         Pagination } from 'semantic-ui-react';

import { get } from '../../../api/api.js';

import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

/* STYLES */
import './Base.css'

/* COMPONENTS */
import BaseTile from '../../../components/Cards/BaseTile/BaseTile.js'
import MyLoader from '../../../components/Loaders/Loader.js'

/* constants */
import { genresOptions,yearsOptions,sortOptions } from './options.js'

class Base extends Component {

    state = {
        result: [],
        genres: [],
        years: [],
        activePage: 1,
        toggleSeen: false,
        sort: 'rate-ascending',
        totalPages: 1,
        searchLoading: true
    }

    componentDidMount() {

        get('/Song/GetSongs/' + this.state.activePage + '?sort=' + this.state.sort).then(data => {
            
            this.setState({ result: data.Results, 
                            totalResult: data.Total,
                            totalPages: Math.ceil(data.Total/10), 
                            searchLoading: false })
        })
    }

    onHandlePageChange = (e,{ activePage }) => {
        e.preventDefault();

        this.setState({ activePage })
        this.setState({ searchLoading: true })

        get('/Song/GetSongs/' + activePage + '?sort=' + this.state.sort).then(data => {
            this.setState({ result: data.Results, searchLoading: false })
        })
    }
    
    onToggleSeenHandler = () => this.setState({ toggleSeen: !this.state.toggleSeen })

    onSearchButtonHandler = () => {

        const { genres,years,toggleSeen,sort } = this.state;

        var query = '';
        query = query + (sort === '' ? '' : '?sort=' + sort)
        query = query + (years.length === 0 ? '' : '&year=' + years.toString());
        query = query + (genres.length === 0 ? '' : '&genre=' + genres.toString());
        query = query + (toggleSeen === true ? '&hidden=true' : '');

        this.setState({ searchLoading: true })

        get('/Song/GetSongs/' + this.state.activePage + query).then(data => {
            
            this.setState({ result: data.Results,
                            totalResult: data.Total,
                            totalPages: Math.ceil(data.Total/10), 
                            searchLoading: false })
        })

    }

    onAddDropdownItem = (e,data) => this.setState({ genres: data.value })

    onAddDropdownYearItem = (e,data) => this.setState({ years: data.value })

    handleSort = (e,data) => {
        var sortOption = '';
        switch(data.value) {
            case 1:
                sortOption = 'rate-ascending';
                break;
            case 2:
                sortOption = 'rate-descending';
                break;
            case 3:
                sortOption = 'votes-ascending';
                break;
            case 4:
                sortOption = 'votes-descending';
                break;
            case 5:
                sortOption = 'oldest';
                break;
            case 6:
                sortOption = 'newest';
                break;
            default:
                sortOption = 'none';
                break;
        }
        this.setState({ sort: sortOption })
    }

    render() {

        const { result,searchLoading,totalPages,activePage } = this.state

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
 
                <div className="base-wrapper">
                    <h1> Baza strony </h1>

                    <div className="control-wrapper" style={{ borderTop: '1px solid #ededed',borderBottom: '1px solid #ededed' }}>
                        <Grid>
                            <Grid.Row>
                                <div className="control-group">
                                    <label> Gatunki: </label>
                                    <Dropdown className='genres-dropdown'
                                                fluid
                                                multiple
                                                noResultsMessage='Brak wyników.'
                                                placeholder='Gatunki...'
                                                search
                                                selection
                                                options={genresOptions}
                                                onChange={this.onAddDropdownItem} />          
                                    
                                </div>

                                <div className="control-group">
                                    <label> Rok produkcji: </label>
                                    <Dropdown className='years-dropdown'
                                                fluid
                                                multiple
                                                noResultsMessage='Brak wyników.'
                                                placeholder='Rok...'
                                                search
                                                selection
                                                options={yearsOptions}
                                                onChange={this.onAddDropdownYearItem} />
                                </div>

                            </Grid.Row>
                        </Grid>
                    </div>

                    <div className="base-elements-wrapper" style={{ padding: '20px 16px 0 16px' }}>

                        <Grid>
                            <Grid.Row style={{ margin: '0' }}>

                                <div style={{ width: '100%', marginBottom: '20px' }}>
                                    <Dropdown className='general-filter' 
                                                clearable 
                                                defaultValue={5}
                                                options={sortOptions} 
                                                selection
                                                onChange={this.handleSort} /> 

                                    <Checkbox className='general-filter' 
                                                label='Ukryj ocenione' 
                                                onClick={this.onToggleSeenHandler}
                                                style={{ marginLeft: '30px' }} />

                                    <Button className='base-search-button'
                                            color='blue'
                                            content='Szukaj'
                                            icon='search'
                                            onClick={this.onSearchButtonHandler} />
                                </div>
                            </Grid.Row>
                        </Grid>

                        <Grid className="base-elements-grid">
                            <Grid.Row>                            
                                <Grid.Column mobile={16} style={{ minHeight: '1000px', padding: '0' }}>
                                    <div style={{ width: '100%', position: 'relative', minHeight: '320px' }}>
                                    {
                                        searchLoading ? <MyLoader /> :
                                                        result.map( (elem,i) => {
                                                            return <BaseTile key={i} 
                                                                             id={elem.id}
                                                                             title={elem.title}
                                                                             performer={elem.description}
                                                                             publication={elem.Publication}
                                                                             album={elem.Album}
                                                                             duration={elem.Duration}
                                                                             genres={elem.Genres}
                                                                             rate={elem.Rate}
                                                                             votes={elem.Votes}
                                                                             userRate={elem.UserRate} />
                                                        })
                                    }
                                    </div>

                                    <div className="base-pagination-wrapper">
                                        { searchLoading ? null : <Pagination activePage={activePage} 
                                                                                totalPages={totalPages} 
                                                                                onPageChange={this.onHandlePageChange} /> }
                                    </div>
                                </Grid.Column>
                                
                            </Grid.Row>
                        </Grid>
                    </div>                 
                </div>
            </ Container>
        )
    }
}

export default Base;