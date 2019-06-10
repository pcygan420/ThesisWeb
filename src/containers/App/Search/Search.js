import React, { Component } from 'react';
import { Grid,
         Container,
         Header,
         Menu,
         Pagination } from 'semantic-ui-react';

import { get } from '../../../api/api.js'

/* STYLES */
import './Search.css'

/* COMPONENTS */
import BaseTile from '../../../components/Cards/BaseTile/BaseTile.js'
import MyLoader from '../../../components/Loaders/Loader.js'

class Search extends Component {

    state = {
        fraze: '',
        activeItem: 'Piosenki',
        results: [],
        total: '?',
        activePage: 1,
        totalPages: 1,
        isLoading: true
    }

    componentWillMount() {
        const search = this.props.match.params.search

        this.setState({ fraze: search })
        
        get('/Song/Search/' + search + '/' + this.state.activePage).then(data => {
            this.setState({ results: data,
                            total: data.length,
                            totalPage: Math.ceil(data.length/10),
                            isLoading: false })
        })
    }

    menuItemChangeHandler = (e, { name }) => this.setState({ activeItem: name })

    onHandlePageChange = (e,{ activePage }) => {
        e.preventDefault();

        this.setState({ activePage })
        this.setState({ searchLoading: true })

        get('/Song/GetSongs/' + activePage).then(data => {
            this.setState({ result: data.Results, searchLoading: false })
        })
    }

    render() {
        
        const { results,total,activeItem,activePage,totalPages,isLoading } = this.state; 

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                    <div className='search-wrapper'>

                        <Grid>
                            <Grid.Row>       
                                <Grid.Column mobile={16}>
                                    <Header className='search-header'
                                            as='h1'
                                            content={ 'Wyniki wyszukiwania dla \'' + this.state.fraze + '\''}
                                            textAlign='center' />

                                    <Menu className='search-menu'
                                          fluid 
                                          widths={2} 
                                          pointing
                                          secondary >

                                        <Menu.Item name='Piosenki' 
                                                   active={activeItem === 'Piosenki'} 
                                                   onClick={this.menuItemChangeHandler} > Piosenki </Menu.Item>
                                        <Menu.Item name='Użytkownicy' 
                                                   active={activeItem === 'Użytkownicy'} 
                                                   onClick={this.menuItemChangeHandler} > Użytkownicy </Menu.Item>
                                    </Menu>

                                    <Header className='results-header'
                                            as='h2' 
                                            dividing 
                                            style={{ paddingTop: '20px' }}> Znalezione({total}): </Header>

                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column style={{ minHeight: '500px' }}>
                                            {
                                                isLoading ? <MyLoader /> :
                                                                results.map( (elem,i) => {
                                                                    return <BaseTile key={i} 
                                                                                    index={ (activePage - 1) * 10 + i + 1}
                                                                                    id={elem.id}
                                                                                    title={elem.title}
                                                                                    performer={elem.description}
                                                                                    genres={elem.Genres} />
                                                                })
                                            }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>

                                </Grid.Column>

                                <Grid.Column mobile={16} style={{ height: '100px', position: 'relative' }}>
                                    <Pagination style={{ position: 'absolute', 
                                                         top: '50%', 
                                                         left: '50%', 
                                                         transform: 'translate(-50%,-50%)' }}
                                                         onPageChange={this.handlePaginationChange}
                                                         activePage={activePage}
                                                         totalPages={totalPages} 
                                                         size={'small'} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>

                    </div>
            </ Container>
        )
    }
}

export default Search;