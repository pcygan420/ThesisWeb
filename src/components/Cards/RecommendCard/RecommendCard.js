import React,{ Component } from 'react';
import { Card,
         Icon,
         List,
         Rating } from 'semantic-ui-react'

/* Styles */
import './RecommendCard.css';

/* COMPONENTS */
import SmallLoader from '../../Loaders/SmallLoader/SmallLoader.js'

class RecommendCard extends Component {
    
    state = {
        song: {},
        rating: 0,
        heartAdded: false,
        isAdding: false
    }

    componentWillMount() {
        this.setState({ song: this.props.song })
    }
    
    ToggleHeartRate = () => {
        this.setState({ heartAdded: !this.state.heartAdded })
    }

    onAddRateHandler = (e, { rating, maxRating }) => {
        const { song } = this.state;
        this.setState({ rating: rating })

        this.props.handleRate(song.id,rating,song.Title,song.Performer);
    }

    render() {

        const { rating,
                heartAdded,
                song,
                isAdding } = this.state;

        return(
            <div className='recommend-wrapper'>
                <Card className='recommend-card base-tile'>
                    <Card.Content>
                        <Card.Header>{song.Title}</Card.Header>

                        <Card.Meta>
                            <span className='date'>{song.Performer}</span>
                        </Card.Meta>

                        <Card.Description>
                            <List horizontal>
                                { song.Album ? <List.Item> Album: <span>{song.Album}</span> </List.Item> : null } 
                                { song.Genres ? <List.Item> Gatunki: <span>{song.Genres}</span> </List.Item> : null } 
                                { song.Duration ? <List.Item> Czas trwania: <span>{song.Duration} min.</span> </List.Item> : null } 
                                { song.Publication ? <List.Item> Rok wydania:<span>{song.Publication} r.</span> </List.Item> : null } 
                            </List>
                        </Card.Description>
                    </Card.Content>

                    <Card.Content extra>
                        <div className='avg-rate'> 
                            {song.Rate.toFixed(1)} 
                            {
                                [...Array(Math.floor(song.Rate))].map((e, i) => <Icon key={i}
                                                                                      name='star'
                                                                                      color='blue'/>)
                            }
                        </div>

                        <a>
                            <Icon name='user'
                                color='blue' /> {song.Votes} ocen użytkowników
                        </a>
                    </Card.Content>
                </Card>

                <div className='rate-prediction'>
                    <div className='prediction'>
                        <Icon name='signal'
                              color='yellow'/> <span> {song.PredictedRate.toFixed(1) * 20}% </span> <span>w Twoim guście</span>
                    </div>

                    <div className='user-rate'>  
                        { 
                            isAdding ? <SmallLoader /> : null 
                        }
                        <div className='user-rate-info'>
                            <span> Słyszałem,</span>

                            <Rating className='favourite-icon'
                                    icon='heart' 
                                    corner='top right'
                                    maxRating={1}
                                    rating={heartAdded ? 1 : 0}
                                    onRate={this.ToggleHeartRate} /> 
                        </div>

                        <div className='user-rate-rating'>
                            <Rating icon='star'
                                    maxRating={5}
                                    rating={rating}
                                    onRate={this.onAddRateHandler} /> 
                        </div>
                    </div>
                    
                </div>
            </div>   
        )
    }
}

export default RecommendCard;