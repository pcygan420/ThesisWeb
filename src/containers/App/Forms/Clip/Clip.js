import React, { Component } from 'react';
import { Button,
         Confirm,
         Container,
         Form,
         Grid,
         Header,
         Message,     
         Segment } from 'semantic-ui-react';


import { post } from '../../../../api/api.js'

/* STYLES */

/* COMPONETNTS */
import CompleteMessage from '../../../../components/Messages/Add/AddComplete.js'

const list = [ 'W polu wyżej znajduję się obecny odnośnik (jeżeli został dodany)',
               'Odnośnik musi prowadzić do teledysku na serwisie youtube.com',
               'Piosenka może mieć tylko jeden odnośnik do teledysku' ]

class Clip extends Component {
    
    state = {
        song: {},
        url: '',
        error: '',
        isSending: false,
        messageShow: false,
        open: false
    }
    
    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value}) 
    
    onSaveButtonClickHandler = () => {

        const { url,song } = this.state;

        if(url === '') {
            this.setState({error: 'To pole nie może być puste.'})
            return;
        } 

        if(url === song.ClipUrl) {
            this.setState({error: 'Nie dokonano żadnych zmian.'})
            return;
        } 
             
        this.setState({ error: '', open: true })     
    }

    onCancelHandler = () => this.setState({ open: false })

    onConfirmHandler = () => {    
        
        const { song,url } = this.state;

        var data = {
            EntityId: song.EntityId,
            Title: song.Title,
            Performer: song.Performer,
            ClipUrl: url
        }

        this.setState({ isSending: !this.state.isSending })
        post('/Song/AddClip',data).then(response => { 
            
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
                                ClipUrl: data.url },
                                url: data.url ? data.url : '' })
    }

    messageClose = () => {
        this.setState({ messageShow: false })
    }

    takeToMainSite = () => {
        this.props.history.push('/');
    }

    render() {
    
        const { song,messageShow,isSending,error,url } = this.state;
        const dimmedBackground = messageShow ? '0.5' : '1';

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                    <div className="link-form" style={{ maxWidth: '660px' }}>
                        <Grid>
                            <Grid.Row style={{ width: '100%', 
                                                margin: 'auto', 
                                                opacity: dimmedBackground,
                                                transition: 'all 0.16s ease-in-out' }}>

                                <Grid.Column mobile={16}>
                                    <Header as='h2' 
                                            style={{ height: 'auto', marginTop: '1rem' }}> Edycja linku dla 
                                            <span style={{ color: '#0e566c' }}> '{song.Title}' </span>
                                    </Header>

                                    <Form>
                                        <Form.Field>
                                            <Form.Input value={song.Performer}
                                                        label='Wykonawca' />      
                                        </Form.Field>     

                                        <Form.Field error={error === '' ? false : true }>
                                            <Form.Input label='Url'
                                                        name='url'
                                                        placeholder='example.com'
                                                        value={url}
                                                        onChange={this.onInputChangeHandler} />

                                            {<div className='error-message'>{error}</div>}
                                        </Form.Field> 

                                        <Message info 
                                                    icon='info'
                                                    header='Edycja teledysku'
                                                    list={list}
                                                    style={{ marginTop: '30px' }} />               
                                    </Form>

                                </Grid.Column>
                            </Grid.Row>     

                            <Grid.Row>
                                <Grid.Column mobile={16}>
                                    {   messageShow ? <CompleteMessage close={this.messageClose}
                                                                       main={this.takeToMainSite}
                                                                       message='Udało Ci się dodać odnośnik do teledysku.' /> :
                                        <Segment vertical>
                                            <Button onClick={this.onSaveButtonClickHandler} 
                                                    name='open' 
                                                    color='blue' 
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

export default Clip;