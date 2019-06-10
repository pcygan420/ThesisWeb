import React, { Component } from 'react';
import { Button,
         Confirm,
         Container,
         Form,
         Grid,
         Header,
         Message,
         Segment,
         TextArea } from 'semantic-ui-react';

import { post } from '../../../../api/api.js'

/* STYLES */
import './EditText.css'

/* COMPONETNTS */
import CompleteMessage from '../../../../components/Messages/Add/AddComplete.js'

const list = [ 'W polu wyżej znajduje się aktualny tekst',
               'Trzeba dokonać jakiejkolwiek zmiany w tekście' ]

class EditTextForm extends Component {
    
    state = {
        song: {},
        text: '',
        textError: '',
        isSending: false,
        messageShow: false,
        open: false
    }
    
    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value}) 
    
    onSaveButtonClickHandler = () => {

        const { song,text } = this.state;

        if(song.Text === '') {
            this.setState({textError: 'To pole nie może być puste.'})
            return;
        } 

        if(song.Text === text) {
            this.setState({textError: 'Nie wprowadzono zmian.'})
            return;
        }
             
        this.setState({ textError: '', open: true })     
    }

    onCancelHandler = () => this.setState({ open: false })

    onConfirmHandler = () => {    
        
        const { song,text } = this.state;

        var data = {
            EntityId: song.EntityId,
            Title: song.Title,
            Performer: song.Performer,
            Text: text
        }

        this.setState({ isSending: !this.state.isSending })
        post('/Song/AddText',data).then(response => { 
            
            this.setState({ isSending: !this.state.isSending, messageShow: !this.state.messageShow }) 
        } )

        this.setState({ open: false })
    }

    componentWillMount() {

        const data = this.props.location.state
        const id = this.props.match.params.id

        this.setState({ song: { EntityId: id,
                                Title: data.title,
                                Performer: data.performer,
                                Text: data.text },
                        text: data.text })
    }

    messageClose = () => {
        this.setState({ messageShow: false })
        window.location.reload();
    }

    takeToMainSite = () => {
        this.props.history.push('/');
    }

    render() {
    
        const { song,messageShow,isSending,textError,text } = this.state;

        const dimmedBackground = messageShow ? '0.5' : '1';

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                    <div className="link-form" style={{ maxWidth: '660px', margin: 'auto' }}>

                        <Grid>
                            <Grid.Row style={{ width: '100%', 
                                                margin: 'auto', 
                                                opacity: dimmedBackground,
                                                transition: 'all 0.16s ease-in-out' }}>

                                <Grid.Column tablet={16}>
                                    <Header as='h2' style={{ height: 'auto' }}>
                                        Edycja tekstu dla piosenki <span style={{ color: '#0e566c' }}> '{song.Title}' </span>
                                    </Header>

                                    <Form>
                                        <Form.Field>
                                            <label> Wykonawca </label>
                                            <Form.Input value={song.Performer} />      
                                        </Form.Field>     

                                        <Form.Field error={textError === '' ? false : true }>
                                            <label> Tekst piosenki: </label>
                                            <TextArea name='text'
                                                        value={text}
                                                        onChange={this.onInputChangeHandler}
                                                        autoComplete="off" 
                                                        autoCorrect="off" 
                                                        autoCapitalize="off" 
                                                        spellCheck="false"
                                                        style={{ minHeight: 500 }} />

                                            {<div className='error-message'>{textError}</div>}
                                        </Form.Field>                   
                                    </Form>

                                    <Message info   
                                                icon='info'
                                                header='Edycja tekstu'
                                                list={list}
                                                style={{ marginTop: '30px' }} />

                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column mobile={16}>
                                    {   messageShow ? <CompleteMessage close={this.messageClose}
                                                                        main={this.takeToMainSite}
                                                                        message='Udało ci się edytować tekst.' /> :

                                        <Segment vertical>
                                                <Button onClick={this.onSaveButtonClickHandler} 
                                                        name="open" 
                                                        color="blue" 
                                                        content='Zakończ'
                                                        icon='pencil'
                                                        loading={isSending}
                                                        style={{ width: '115px' }} />

                                                <Confirm open={this.state.open}
                                                        content='Czy na pewno chcesz wysłać formularz?'
                                                        cancelButton='Anuluj'
                                                        confirmButton="Zatwierdź"
                                                        onCancel={this.onCancelHandler}
                                                        onConfirm={this.onConfirmHandler} />
                                        </Segment>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>  

                    </div>
            </Container>
        )
    }
}

export default EditTextForm;