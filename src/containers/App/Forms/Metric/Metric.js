import React, { Component } from 'react';
import { Button,
         Confirm,
         Container,
         Dropdown,
         Form,
         Grid,
         Header,
         Message,
         Segment,
         TextArea } from 'semantic-ui-react';

import { get,post } from '../../../../api/api.js'

/* Style */
import './Metric.css'

/* COMPONETNTS */
import CompleteMessage from '../../../../components/Messages/Add/AddComplete.js'

const list = [ 'W polach znajdują się aktualne wartości metryki',
               'Aby dokonać edycji należy dokonać jakiejkolwiek zmiany' ]

const genresOptions = [ { key: '1', value: 'Rock', text: 'Rock' }, 
                        { key: '2', value: 'Pop', text: 'Pop' },
                        { key: '3', value: 'Punk', text: 'Punk' },
                        { key: '4', value: 'Metal', text: 'Metal' },
                        { key: '5', value: 'Rap', text: 'Rap' },
                        { key: '6', value: 'Hip-Hop', text: 'Hip-Hop' },
                        { key: '7', value: 'Country', text: 'Country' },
                        { key: '8', value: 'Jazz', text: 'Jazz' },
                        { key: '9', value: 'Rock alternatywny', text: 'Rock alternatywny' },
                        { key: '10', value: 'Rock klasyczny', text: 'Rock klasyczny' },
                        { key: '11', value: 'Disco polo', text: 'Disco polo' },
                        { key: '12', value: 'Heavy Metal', text: 'Heavy Metal' },
                        { key: '13', value: 'Klasyka', text: 'Klasyka' },
                        { key: '14', value: 'Opera', text: 'Opera' },
                        { key: '15', value: 'Reggae', text: 'Reggae' },
                        { key: '16', value: 'Soul', text: 'Soul' } ] 

class Metric extends Component {
    
    state = {
        metric: { Performer: '', Title: '' },
        album: '',
        duration: '',
        publicationDate: '',
        curiosities: '',
        genres: [],
        error: '',
        open: false,
        isSending: false,
        messageShow: false
    }

    componentWillMount = () => {

        get('/Song/GetMetric/' + this.props.match.params.id).then(data => {
            console.log(data)
            this.setState({ metric: data })

            const { metric } = this.state;
            this.setState({ album: metric.Album ? metric.Album : '',
                            duration: metric.Duration ? metric.Duration : '',
                            publicationDate: metric.PublicationDate ? metric.PublicationDate : '',
                            genres: metric.Tags ? metric.Tags.split(',') : [],
                            curiosities: metric.Curiosities ? metric.Curiosities : '' })
        })
    }

    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value }) 
    
    onSaveButtonClickHandler = () => {
        if(!this.validateForm())
            return;

        this.setState({ error: '',open: true })       
    }

    onCancelHandler = () => this.setState({ open: false })

    onConfirmHandler = () => {        

        const { album,curiosities,duration,genres,publicationDate } = this.state;
        let metric = this.state.metric;
        
        metric['Album'] = album;
        metric['Duration'] = duration;
        metric['PublicationDate'] = publicationDate;
        metric['Curiosities'] = curiosities;
        metric['Tags'] = genres.toString()
        metric['User'] = localStorage.getItem('userName')
        
        this.setState({ isSending: !this.state.isSending })
        post('/Song/AddMetric',metric).then(response => { 
            
            this.setState({ isSending: !this.state.isSending, messageShow: !this.state.messageShow }) 
        })

        this.setState({ open: false })
    }

    validateForm() {
        const { metric,album,duration,publicationDate,curiosities,genres } = this.state;
        
        if( (album === metric.Album || album === '') && 
            (duration === metric.Duration || duration === '') && 
            (publicationDate === metric.publicationDate || publicationDate === '') && 
            (curiosities === metric.Curosities || curiosities === '') && 
            (genres.join(',') === metric.Tags || genres.toString() === ''))
        {
            this.setState({ error: 'Nie dokonano żadnych zmian!' })
            return false;
        } else    
            return true;
    }

    onAddDropdownItem = (e,data) => {
        
        this.setState({ genres: data.value })
    }

    takeToMainSite = () => {
        this.props.history.push('/');
    }

    render() {

        const { metric,error,messageShow,isSending,album,duration,publicationDate,genres,curiosities } = this.state;
    
        const dimmedBackground = messageShow ? '0.5' : '1';

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>
                    <div className="link-form" style={{ maxWidth: '660px' }}>
    
                        <Grid>
                            <Grid.Row style={{ width: '100%', 
                                                margin: 'auto', 
                                                opacity: dimmedBackground,
                                                transition: 'all 0.16s ease-in-out' }}>

                                <Grid.Column tablet={16}>
                                    <Header as='h2' style={{ height: '45px' }}>
                                        Edycja metryki dla <span style={{ color: '#0e566c' }}> '{ metric.Title }' </span>
                                    </Header>

                                    <Form>
                                        <Form.Field>
                                            <label> Wykonawca </label>
                                            <Form.Input value={metric.Performer} />      
                                        </Form.Field>   
                                        
                                        <Form.Field>
                                            <Form.Input label='Album'
                                                        value={album}
                                                        name='album'
                                                        onChange={this.onInputChangeHandler} />
                                        </Form.Field>   

                                        <Form.Field>
                                            <Form.Input label='Długość'
                                                        value={duration}
                                                        name='duration'
                                                        onChange={this.onInputChangeHandler} />
                                        </Form.Field>  

                                        <Form.Field>
                                            <Form.Input label='Data wydania'
                                                        value={publicationDate}
                                                        name='publicationDate'
                                                        onChange={this.onInputChangeHandler} />
                                        </Form.Field>  

                                        <Form.Field>
                                            <label> Ciekawostki: </label>
                                            <TextArea value={curiosities}
                                                        name='curiosities'
                                                        onChange={this.onInputChangeHandler}
                                                        autoComplete="off" 
                                                        autoCorrect="off" 
                                                        autoCapitalize="off" 
                                                        spellCheck="false"
                                                        style={{ minHeight: 120 }} />
                                        </Form.Field>  

                                        <Form.Field>
                                            <label> Gatunki </label>
                                            <Dropdown className='genres-dropdown'
                                                        fluid
                                                        multiple
                                                        noResultsMessage='Brak wyników.'
                                                        placeholder='Gatunki...'
                                                        search
                                                        selection
                                                        options={genresOptions}
                                                        onChange={this.onAddDropdownItem}
                                                        value={genres} />
                                        </Form.Field>  
                                        
                                        <Form.Field error={ error === '' ? false : true }>
                                            
                                            {<div className='error-message'>{error}</div>}
                                        </Form.Field>  

                                        <Message info 
                                                 icon='info'
                                                 header='Edycja metryki'
                                                 list={list}
                                                 style={{ marginTop: '30px' }} />                  
                                    </Form>

                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column mobile={16}>
                                    {   messageShow ? <CompleteMessage close={this.messageClose}
                                                                       main={this.takeToMainSite}
                                                                       message='Udało ci się edytować metrykę.' /> :
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

export default Metric;