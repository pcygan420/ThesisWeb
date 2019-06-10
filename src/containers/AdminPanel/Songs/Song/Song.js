import React, { Component } from 'react';
import { Button,
         Confirm,
         Form,
         Grid,
         Header,
         Menu,
         Segment,
         TextArea } from 'semantic-ui-react';

import { get,post } from '../../../../api/api.js'

class songForm extends Component {
    
    state = {
        song: { EntityId: '',
                Album: '',
                Duration: '',
                Genres: '',
                Publication: '',
                Curiosities: '' },
        title: '',
        performer: '',
        text: '',
        translation: '',
        clipUrl: '',
        activeItem: 'text',
        errorMessage: '',
        isAdding: false
    }

    componentWillMount() {

        get('/Admin/Get/' + this.props.location.state.id).then(data => {
            this.setState({ song: data,
                            title: data.Title,
                            performer: data.Performer,
                            text: data.Text,
                            translation: data.Translation === null ? '' : data.Translation,
                            clipUrl: data.ClipUrl === null ? '' : data.ClipUrl })
        })
    }

    validate() {
        const { song,title,performer,text,translation,clipUrl } = this.state;

        if(song.Title === title && song.Performer === performer && song.Text === text && song.Translation === translation && song.ClipUrl === clipUrl) {
            this.setState({ errorMessage: 'Nie dokonano żadnych zmian.' })
            return false;
        } else {
            this.setState({ errorMessage: '' })
            return true;
        }
    }

    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value}) 
    

    onSaveHandler = e => {
        
        if(!this.validate())
            return;
        
        this.setState({ [e.target.name]: e.target.value}) 
    }
    
    onCancelHandler = () => this.setState({ open: false })
    onConfirmHandler = () => {
        
        const { title,performer,translation,text,clipUrl } = this.state;
        this.setState({ open: false, isAdding: true })

        var data = {
            Title: title,
            Performer: performer,
            Translation: translation,
            Text: text,
            ClipUrl: clipUrl
        }

        post('/Admin/Edit/' + this.state.song.EntityId, data).then(response => {
            this.setState({ isAdding: false })
            this.props.history.goBack()
            this.props.notification('Edit')
        })
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {

        const { song,
                activeItem,
                title,
                performer,
                clipUrl,
                text,
                translation,
                errorMessage,
                isAdding } = this.state;

        return(
            <div className="link-form" style={{ maxWidth: '600px', padding: '0' }}>
                <Header as='h2' 
                        content='Dane piosenki'
                        dividing 
                        style={{ margin: '0 1rem' }}/>

                <Segment vertical style={{ width: '100%', margin: 'auto'}}>
                    <Form>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column mobile={16}>   
                                    <Form.Field>                 
                                        <Form.Input className="link-input"
                                                    label='Id'
                                                    labelPosition='left'
                                                    value={song.EntityId}
                                                    disabled />
                                    </Form.Field>

                                    <Form.Field>   
                                        <Form.Input className="link-input"
                                                    label='Tytuł'
                                                    labelPosition='left'
                                                    name='title'
                                                    value={title}
                                                    onChange={this.onInputChangeHandler}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Zespół'
                                                    labelPosition='left'
                                                    name='author'
                                                    value={performer}
                                                    onChange={this.onInputChangeHandler} />     
                                    </Form.Field>                              
                            
                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Album'
                                                    labelPosition='left'
                                                    value={song.Album}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Długość'
                                                    labelPosition='left'
                                                    value={song.Duration}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Gatunki'
                                                    labelPosition='left'
                                                    value={song.Genres}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Data wydania'
                                                    labelPosition='left'
                                                    value={song.Publication}/>
                                    </Form.Field>

                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Ciekawostki'
                                                    labelPosition='left'
                                                    value={song.Curiosities}/>
                                    </Form.Field>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column computer={16}> 

                                    <Menu pointing secondary widths={2}>
                                        <Menu.Item name='text' 
                                                active={activeItem === 'text'} 
                                                onClick={this.handleItemClick} />
                                        <Menu.Item name='translation'
                                                   active={activeItem === 'translation'}
                                                   onClick={this.handleItemClick}/>
                                    </Menu>

                                    <TextArea label='Opis'
                                              name={activeItem === 'text' ? 'text' : 'translation'}
                                              value={activeItem === 'text' ? text : translation}
                                              style={{ minHeight: '450px', margin: '1rem 0' }}
                                              onChange={this.onInputChangeHandler}/>

                                    <Form.Field>
                                        <Form.Input className="link-input"
                                                    label='Odnośnik youtube'
                                                    labelPosition='left'
                                                    value={clipUrl}/>
                                    </Form.Field>

                                    { <div className='error-message'> {errorMessage} </div> }                             

                                </Grid.Column>                
                            </Grid.Row>
                        </Grid>
                                    
                    </Form>  
                </Segment>
                
                <Segment vertical 
                         style={{ marginLeft: '1rem' }}>

                        <Button onClick={this.onSaveHandler} 
                                name="open"                          
                                color="blue" 
                                content='Zatwierdź'
                                icon='check circle outline'
                                loading={isAdding}
                                value="true"/>

                        <Confirm open={this.state.open}
                                 content='Czy na pewno chcesz wprowadzić zmiany?'
                                 cancelButton='Cancel'
                                 confirmButton="Save"
                                 onCancel={this.onCancelHandler}
                                 onConfirm={this.onConfirmHandler}/>
                </Segment>
            </div>
        )
    }
}

export default songForm;