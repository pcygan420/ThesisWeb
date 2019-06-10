import React, { Component } from 'react';

import { Container,
         Header,
         List,
         Message } from 'semantic-ui-react';

/* STYLES */
import './Information.css';

class Information extends Component {

    componentWillMount() {

    }

    render() {


        return(
            <Container fluid
                       style={{maxWidth: '1920px', padding: '0'}}>
                <div className='information'>
                 
                    <Container text>
                        <Header as='h1'
                                content='O stronie'
                                textAlign='left' />

                        <p>
                            Phasellus non ex et dolor congue aliquet. Ut sollicitudin tristique scelerisque. Nulla eu volutpat orci. Suspendisse in orci eu libero cursus congue. Sed id neque a nulla dapibus imperdiet at at lacus. In posuere ante quis urna sagittis, vel tincidunt lorem egestas. Ut dapibus nisl vestibulum, congue lorem et, maximus massa. Suspendisse tempor massa justo, a rutrum justo maximus a. Maecenas semper, ligula tincidunt pretium lacinia, dui erat tincidunt risus, ut ornare eros lacus vitae erat. In hac habitasse platea dictumst.
                        </p>

                        <Message info 
                                 icon='info'
                                 header='Inspiracja'
                                 content='Strona jest inspirowana oraz jest podobna do popularnego polskiego serwisu tekstowo.pl. Moja implementacja ma się odróżniać od wcześniej wspomnianego źródła inspiracji responsywnością, lepszą (choć prostą) szatą graficzną oraz systemem rekomendacji.' />
  
                        <Header as='h1'
                                content='Zdobywanie punktów'
                                textAlign='left'
                                style={{ marginTop: '70px' }} />
                            
                        <List as='ol'>
                            <List.Item as='li' value='1.'>
                                Dodanie piosenki (tytułu, wykonawcy oraz tekstu) - <span>10 punktów</span>.
                            </List.Item>
                            <List.Item as='li' value='2.'>
                                Dodanie tłumaczenia tekstu piosenki - <span>5 punktów</span>.
                            </List.Item>
                            <List.Item as='li' value='3.'>
                                Dodanie linku do teledysku danej piosenki (link musi prowadzić do serwisu Youtube) - <span>3 punkty</span>.
                            </List.Item>
                            <List.Item as='li' value='4.'>
                                Edycja metryki piosenki - <span>3 punkty</span>.
                            </List.Item>
                            <List.Item as='li' value='5.'>
                                Poprawienie tekstu piosenki - <span>1 punkt</span>.
                            </List.Item>
                            <List.Item as='li' value='6.'>
                                Poprawienie tłumaczenia piosenki - <span>1 punkt</span>.
                            </List.Item>         
                        </List>

                        <Message info 
                                 icon='help' 
                                 header='Warunek otrzymania punktów' 
                                 content="Aby otrzymać punkty nie wystarczy dodać tekstu bądź innej informacji na stronie. Akcje dokonywane przez użytkowników muszą zostać zatwierdzone przez administratora." />

                        <Header as='h1'
                                content='Inne'
                                textAlign='left'
                                style={{ marginTop: '70px' }} />

                        <List as='ol'>
                            <List.Item as='li' value='1.'>
                                Nie ma możliwości zmiany nazwy użytkownika.
                            </List.Item>
                            <List.Item as='li' value='2.'>
                                Zbierane przez użytkowników punkty to wskaźnik aktywności na serwisie - nic poza tym.
                            </List.Item>  
                            <List.Item as='li' value='3.'>
                                Rekomender oparty jest na algorytmie <span>Najbliższych Sąsiadów</span> - działa tym lepiej, im więcej ocen danego użytkownika. Nie zadziała dla użytkownika, który nie ocenił niczego (wymagane jest minimum 5 ocen).
                            </List.Item>                  
                            <List.Item as='li' value='4.'>
                                Arsenal F.C.
                            </List.Item>                                
                        </List>

                        <Message info
                                 icon='copyright' 
                                 header='Prawa autorskie' 
                                 content="Teksty są zamieszczane na stronie w celach edukacyjnych, nie komercyjnych. W razie potrzeby będą usuwane." />

                        </Container>  
                </div>
            </Container>
        )
    }
}

export default Information;