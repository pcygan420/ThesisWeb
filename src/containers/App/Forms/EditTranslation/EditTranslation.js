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

/* Style */
import './EditTranslation.css'

/* COMPONETNTS */
import CompleteMessage from '../../../../components/Messages/Add/AddComplete.js'

const error = [ 'Puste pole.','Nie wprowadzono zmian.' ]

const list = [ 'Oryginalny tekst poglądowo znajduję się po lewej stronie',
               'Aktualne tłuamczenie znajduję się po prawej stronie',
               'Trzeba dokonać jakiejkolwiek zmiany w tłumaczeniu' ]

class EditTranForm extends Component {
    
    state = {
        song: { Text: '' },
        translation: '',
        error: '',
        open: false,
        isSending: false,
        messageShow: false
    }

    componentWillMount = () => {

        const data = this.props.location.state
        const id = this.props.match.params.id
        
        this.setState({ song: { EntityId: id,
                                Title: data.title,
                                Performer: data.performer,
                                Text: data.text,
                                Translation: data.translation },
                        translation: data.translation ? data.translation : '' })
    }

    validation = () => {

        const { song, translation } = this.state;

        if(translation === '') {
            this.setState({ error: error[0] })
            return false;
        }

        if(translation === song.Translation) {
            this.setState({ error: error[1] })
            return false;
        }

        return true;
    }

    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value }) 
    
    onSaveButtonClickHandler = () => {

        if(!this.validation())
            return;

        this.setState({ open: true })       
    }

    onCancelHandler = () => this.setState({ open: false })

    onConfirmHandler = () => {        

        const { translation } = this.state;
        let song = this.state.song;
        
        song['Translation'] = translation;
        
        this.setState({ isSending: !this.state.isSending })
        post('/Song/AddTran',song).then(response => { 
            
            this.setState({ isSending: !this.state.isSending, messageShow: !this.state.messageShow }) 
        })

        this.setState({ open: false })
    }

    takeToMainSite = () => {
        this.props.history.push('/');
    }

    render() {

        const { song,translation,error,messageShow,isSending } = this.state;

        const dimmedBackground = messageShow ? '0.5' : '1';
    
        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                    <div className="link-form" style={{ maxWidth: '720px' }}>

                        <Grid>
                            <Grid.Row style={{ width: '100%', 
                                               margin: 'auto',
                                               opacity: dimmedBackground,
                                               transition: 'all 0.16s ease-in-out' }}>

                                <Grid.Column tablet={16}>
                                    <Header as='h2' style={{ height: 'auto' }}>
                                        Edycja tłumaczenia <span style={{ color: '#0e566c' }}> '{ song.Title }' </span>
                                    </Header>

                                    <Form>
                                        <Form.Field>
                                            <label> Wykonawca </label>
                                            <Form.Input value={song.Performer}
                                                        disabled />      
                                        </Form.Field>   
                                        
                                        <Form.Field className='edit-tran-textarea left'>
                                            <label>Tekst piosenki</label>
                                            <Form.TextArea name='text'
                                                            value={song.Text}
                                                            autoComplete="off" 
                                                            autoCorrect="off" 
                                                            autoCapitalize="off" 
                                                            spellCheck="false" />
                                        </Form.Field>   
                                        
                                        <Form.Field className='edit-tran-textarea right' error={ error === '' ? false : true } >
                                            <label>Tłumaczenie</label>
                                            <TextArea name='translation'
                                                        value={translation}
                                                        onChange={this.onInputChangeHandler}
                                                        autoComplete="off" 
                                                        autoCorrect="off" 
                                                        autoCapitalize="off" 
                                                        spellCheck="false" />
                                                            
                                            {<div className='error-message'>{error}</div>}
                                        </Form.Field>                  
                                    </Form>

                                    <Message info   
                                                icon='info'
                                                header='Edycja tłumaczenia'
                                                list={list} />

                                </Grid.Column>
                            </Grid.Row>
                        
                            <Grid.Row>
                                <Grid.Column mobile={16}>
                                    {   messageShow ? <CompleteMessage close={this.messageClose}
                                                                       main={this.takeToMainSite}
                                                                       message='Udało ci się edytować tłumaczenie.' /> :
                                        <Segment vertical>
                                                <Button onClick={this.onSaveButtonClickHandler} 
                                                        loading={isSending}
                                                        name="open" 
                                                        color="blue" 
                                                        content='Zakończ'
                                                        icon='pencil'
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

export default EditTranForm;