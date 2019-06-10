import React, { Component } from 'react';
import { Button,
         Confirm,
         Container,
         Form,
         Grid,
         Header,
         Message,
         Popup,
         Segment } from 'semantic-ui-react';

import { withRouter } from 'react-router'
import { post } from '../../../../api/api.js'

/* STYLES */
import './AddSong.css'

/* COMPONETNTS */
import CompleteMessage from '../../../../components/Messages/Add/AddComplete.js';

const error_messages = [ 'To pole nie może być puste.' ]
const list = [ 'W bazie nie może być dwóch piosenek o tym samym tytule oraz wykonawcy',
               'Tekst musi być w oryginalnym języku' ]

class AddSongForm extends Component {
    
    state = {
        title: '',
        author: '',
        text: '',
        titleError: '',
        authorError: '',
        textError: '',
        message: '',
        open: false,
        isChecking: false,
        isSending: false,
        messageShow: false
    }

    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value}) 
    
    validate() {
        var titleValid = this.validateForm('title');
        var performerValid = this.validateForm('performer');
        var textValid = this.validateForm('text');

        this.setState({ titleError: !titleValid ? error_messages[0] : ''})
        this.setState({ authorError: !performerValid ? error_messages[0] : ''})
        this.setState({ textError: !textValid ? error_messages[0] : ''})

        if(titleValid && performerValid && textValid)
            return true;
        else
            return false;
    }

    validateForm(field) {

        const re = /^(?!\s*$).+/;
        switch(field) {
            case 'title':
                const { title } = this.state;
                return re.test(String(title));
            case 'performer':
                const { author } = this.state;
                return re.test(String(author))
            case 'text':
                const { text } = this.state;
                return re.test(String(text))
            default:
                return;
        }
    }

    /* Click 'Send' button */
    onSaveButtonClickHandler = () => {

        if(!this.validate()) 
            return false;

        this.setState({ open: true })            
    }

    onCancelHandler = () => this.setState({ open: false })

    onCheckSongHandler = () => {

        var titleValid = this.validateForm('title');
        var performerValid = this.validateForm('performer');

        this.setState({ titleError: !titleValid ? error_messages[0] : ''})
        this.setState({ authorError: !performerValid ? error_messages[0] : ''})

        if(!titleValid || !performerValid)
            return false;

        const form = this.state;
        var data = {
            Title: form.title,
            Performer: form.author
        }

        this.setState({ isChecking: !this.state.isChecking })

        post('/Song/Check',data).then(response => {
            
            if(response.data)
                this.setState({ message: 'Nie znaleziono piosenki o danym tytule i danego wykonawcy.' })                
            else 
                this.setState({ message: 'Piosenka jest już w serwisie.' })

            this.setState({ isChecking: !this.state.isChecking })

            setTimeout( () => { this.setState({ message: '' }) } ,3000 );
        })        
    }

    onConfirmHandler = () => {        

        const form = this.state;

        var data = {
            Title: form.title,
            Performer: form.author,
            Text: form.text,
            Album: form.album,
            Duration: form.duration,
            PublicationDate: form.published
        }

        this.setState({ isSending: !this.state.isSending })
        post('/Song/AddSong',data).then(response => { 
            
            this.setState({ isSending: !this.state.isSending, messageShow: !this.state.messageShow }) 
        } )

        this.setState({ open: false })
    }

    reloadPageHandler = () => {
        window.location.reload();
    }

    messageClose = () => {
        this.setState({ messageShow: false })
    }

    addNewSong = () => {
        this.messageClose();

        this.setState({ title: '',
                        author: '',
                        text: '' })
    }

    takeToMainSite = () => {
        this.props.history.push('/');
    }

    render() {

        const { messageShow,
                title,
                author,
                text } = this.state;
        const dimmedBackground = messageShow ? '0.5' : '1';

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                    <div className='add-song-form-wrapper' style={{ backgroundColor: 'white' }}>

                        <div className="link-form" style={{ maxWidth: '1000px', margin: 'auto' }}>
                                                 
                            <Segment vertical style={{ width: '100%', 
                                                       margin: 'auto', 
                                                       opacity: dimmedBackground,
                                                       transition: 'all 0.16s ease-in-out' }}>

                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column tablet={16} style={{ padding: '0' }}>
                                            <Header as='h1' 
                                                    content='Dodaj piosenkę'
                                                    dividing
                                                    style={{ height: '45px' }} />

                                            <Form>
                                                <Form.Field>
                                                    <Form.Input className="link-input"
                                                                name='title'
                                                                label='Tytuł'
                                                                placeholder='Tytuł piosenki'
                                                                value={title}
                                                                error={ this.state.titleError === '' ? false : true } 
                                                                onChange={this.onInputChangeHandler} />

                                                    {<div className='error-message'>{this.state.titleError}</div>}
                                                </Form.Field>

                                                <Form.Field>
                                                    <Form.Input className="link-input"
                                                                name='author'
                                                                label='Wykonawca'
                                                                placeholder='Zespół lub piosenkarz'
                                                                value={author}
                                                                error={ this.state.authorError === '' ? false : true }
                                                                onChange={this.onInputChangeHandler} />

                                                    {<div className='error-message'>{this.state.authorError}</div>}
                                                </Form.Field>
                                                
                                                <div style={{ width: '100%' }}>
                                                    <Popup position='right center' 
                                                            wide='very' 
                                                            trigger={ <Button color='grey'
                                                                                content='Sprawdź'
                                                                                loading={this.state.isChecking}
                                                                                style={{ width: '100px', marginBottom: '20px' }}
                                                                                onClick={this.onCheckSongHandler} />  } 
                                                            content='Sprawdź czy piosenka jest już w serwisie.' />

                                                    <span className='check-song-message'> {this.state.message} </span>
                                                </div>

                                                <Form.Field required error={this.state.textError === '' ? false  : true } >
                                                    <Form.TextArea className='add-song-form-textarea'
                                                                   name='text'
                                                                   label='Tekst piosenki'
                                                                   placeholder='Oryginalny tekst'
                                                                   value={text}
                                                                   onChange={this.onInputChangeHandler} />

                                                    {<div className='error-message'>{this.state.textError}</div>}
                                                </Form.Field>

                                                <Message info 
                                                         icon='info'
                                                         header='Dodawanie piosenki'
                                                         list={list} />           
                                            </Form>

                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>                                
                            </Segment>

                            {   messageShow ? <CompleteMessage close={this.messageClose}
                                                               main={this.takeToMainSite}
                                                               newButton='Dodaj nową piosenkę'
                                                               new={this.addNewSong}
                                                               message='Udało Ci się dodać piosenkę.' /> :

                                <Segment vertical>                                              
                                        <Button onClick={this.onSaveButtonClickHandler} 
                                                name="open" 
                                                color="blue" 
                                                content='Zakończ'
                                                icon='pencil'
                                                loading={this.state.isSending}
                                                style={{ width: '120px' }} /> 
                                        
                                        <Confirm open={this.state.open}
                                                content='Czy na pewno chcesz wysłać formularz?'
                                                cancelButton='Anuluj'
                                                confirmButton="Zatwierdź"
                                                onCancel={this.onCancelHandler}
                                                onConfirm={this.onConfirmHandler} />
                                </Segment>
                            }
                        </div>
                    </div>
                </Container>
        )
    }
}

export default withRouter(AddSongForm);