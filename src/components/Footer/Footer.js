import React from 'react';
import { Grid, 
         Header,
         Icon,
         List } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';

/* Styles */
import './Footer.css';

const Footer = () => {

    return(

            <Grid className='footer' style={{ margin: '0' }}> 
                    <Grid.Row style={{ height: '100%' }}>

                        <Grid.Column mobile={16} computer={4}>
                            <Header as='h2' 
                                    style={{ color: 'white' }}> Informacje
                            </Header>

                            <List size='medium' 
                                  verticalAlign='middle' >
                                <List.Item>
                                    <List.Content> 
                                        <NavLink to='/informacje'
                                                 style={{ color: 'white' }}> O stronie </NavLink> 
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>

                        <Grid.Column mobile={16} computer={8}>
                                <Header as='h2' 
                                        style={{ color: 'white' }}> Praca inżynierska
                                </Header>

                                <div style={{ textIndent: '4rem', 
                                              fontSize: '15px', 
                                              color: '#cecece' }}> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis fringilla felis. Sed ac lectus rutrum, vulputate nunc sed, fermentum lorem. Phasellus consectetur quam ac orci ultricies, non maximus nunc vulputate.
                                </div>
                        </Grid.Column>

                        <Grid.Column mobile={16} computer={4}>
                            <Header as='h2' 
                                    style={{ color: 'white' }}> Linki
                            </Header>
                            <List size='medium' 
                                  verticalAlign='middle' >
                                <List.Item>
                                    <List.Content> 
                                        <NavLink to='/'
                                                 style={{ color: 'white' }}> Główna </NavLink>
                                    </List.Content>
                                </List.Item>

                                <List.Item>
                                <List.Content> 
                                        <NavLink to='/baza'
                                                 style={{ color: 'white' }}> Baza </NavLink>
                                    </List.Content>
                                </List.Item>

                                <List.Item>
                                    <List.Content> 
                                        <NavLink to='/dodaj-piosenke'
                                                 style={{ color: 'white' }}> Dodaj piosenkę </NavLink>
                                    </List.Content>
                                </List.Item>

                                <List.Item>
                                    <List.Content> 
                                        <NavLink to='/rekomender'
                                                 style={{ color: 'white' }}> Rekomender </NavLink>
                                    </List.Content>
                                </List.Item>
                            </List>  
                        </Grid.Column>

                    </Grid.Row>
                    <Grid.Row className='footer-bottom'>
                        <span> <Icon name='copyright outline' /> 2019     Praca inżynierska</span>
                    </Grid.Row>       
            </Grid>
    )
}

export default Footer;