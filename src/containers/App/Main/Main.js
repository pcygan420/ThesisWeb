import React, { Component } from 'react'
import { Container,
         Grid,
         Header } from 'semantic-ui-react';

import axios from 'axios'
import { getToken } from '../../../api/api.js'

/* Components */
import MyLoader from '../../../components/Loaders/Loader.js'

import SongList from '../../../components/Lists/SongsList/SongsList.js'
import ExpectantList from '../../../components/Lists/ExpectantList/ExpectantList.js'
import LinkCard from '../../../components/Cards/LinkCard/LinkCard.js'

import Slider from 'react-slick';

/* Styles */ 
import './Main.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

class Main extends Component {

    state = {
        songs: [],
        expectants: [],
        clips: [],
        slider_index: 1,
        songsLoading: true,
    }

    onButtonNextHandler = () => {
        let update_slider_index = this.state.slider_index;
        if(update_slider_index < Object.keys(this.state.cards).length - 1)
            update_slider_index = update_slider_index + 1;

        this.setState({slider_index: update_slider_index})
    }

    onButtonPrevHandler = () => {
        let update_slider_index = this.state.slider_index;

        if(update_slider_index > 0)
            update_slider_index = update_slider_index - 1;
            
        this.setState({slider_index: update_slider_index})
    }
    
    componentWillMount() {

        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + getToken()
        }

        var that = this;

        axios.all([
            axios.get('/Song/GetRecent', { headers: headers }),
            axios.get('/Song/GetExpectants', { headers: headers }),
            axios.get('/Song/GetClips', { headers: headers })
          ])
          .then(axios.spread(function (recent, expect, clip) {

              that.setState({ songs: recent.data,
                              expectants: expect.data,
                              clips: clip.data,
                              songsLoading: false })

                              
          }))
    }

    render() {

        const { songsLoading,songs,expectants } = this.state;

        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            initialSlide: 0,
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 920,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  initialSlide: 2
                }
              },
              {
                breakpoint: 630,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          };

        return (
            <Container fluid style={{maxWidth: '1920px', padding: '0',margin: '0' }}>   
                <div className="Wrapper">             
                    <Grid>                    
                        <Grid.Row>
                            <Grid.Column mobile={16} >
                                <Header as='h2'
                                        content='Ostatnio dodane piosenki'
                                        dividing
                                        icon='music' />
                            </Grid.Column>

                            <Grid.Column mobile={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column className='songs-holder'
                                                     style={{ padding: '0' }} >
                                        { songsLoading ? <MyLoader /> : <SongList songs={songs}/> }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>

                        </Grid.Row>                        
                    </Grid>  
                </div>

                <div className="Wrapper" style={{ height: 'auto', paddingBottom: '100px' }}>
                    
                    <Grid>                    
                        <Grid.Row>
                            <Grid.Column mobile={16} >
                                <Header as='h2'
                                        content='Oczekiwane tłumaczenia'
                                        dividing
                                        icon='wait' />
                                
                            </Grid.Column>

                            <Grid.Column mobile={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column className='expectants-holder'
                                                     style={{ padding: '0' }} >

                                            { songsLoading ? <MyLoader /> : <ExpectantList expectants={expectants}/> }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>

                        </Grid.Row>                        
                    </Grid>  
                </div>

                <div className="Wrapper">             
                    <Grid>      
                    <Grid.Row>
                            <Grid.Column mobile={16} >
                                <Header as='h2'
                                        content='Ostatnio dodane teledyski'
                                        dividing
                                        icon='youtube' />
                                
                            </Grid.Column>

                            <Grid.Column mobile={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column style={{ margin: '30px 0', height: '225px' }} >

                                            <Slider {...settings} >
                                                { songsLoading ? 
                                                    <MyLoader /> : 
                                                    Object.entries(this.state.clips).map( ([key,value],i) => {

                                                        return <LinkCard index={i+1} 
                                                                         key={key}
                                                                         title={value.Title} 
                                                                         performer={value.Performer}
                                                                         clip={value.Url} />                                       
                                                }) }
                                            </Slider>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>

                        </Grid.Row>
                    </Grid>
                </div>
            </Container>
        );
      }
}

export default Main;