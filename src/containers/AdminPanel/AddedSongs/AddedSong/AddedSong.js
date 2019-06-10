import React, { Component } from 'react';
import { Segment,
         Header,
         Form,
         Input,
         TextArea } from 'semantic-ui-react';

import { get, post, remove } from '../../../../api/api.js'

import AcceptButton from '../../../../components/Buttons/AcceptButton.js'
import DeleteButton from '../../../../components/Buttons/DeleteButton.js'

class TextForm extends Component {
    
    state = {
        addedSong: { AddedSongId: '', User: '', Performer: '', Title: '', AddDate: '', Text: '' },
        isApproving: false,
        isDeleting: false
    }
    
    handleTextChange = (event) => {
        this.setState({ textCopy: event.target.value });
    }

    componentWillMount() { 

        get('/Song/GetAddedSong/' + this.props.location.state.id).then(data => {
            this.setState({ addedSong: data })
        })
    }

    onApproveButtonHandler = () => {
        
        this.setState({ isApproving: !this.state.isApproving })
        post('/Song/ApproveSong/' + this.state.addedSong.AddedSongId, {}).then(response => {

            this.setState({ isApproving: !this.state.isApproving })
            this.props.history.goBack()
            this.props.notification('Accept')
            
        })
    }

    onDeleteButtonHandler = () => {

        this.setState({ isDeleting: !this.state.isDeleting })
        remove('/Song/DeleteSong/' + this.state.addedSong.AddedSongId).then(response => {

            this.setState({ isDeleting: !this.state.isDeleting })
            this.props.history.goBack()
            this.props.notification('Delete')
        })
    }

    render() {

        const { addedSong } = this.state;

        return(
            <div className="link-form" style={{ maxWidth: '600px', margin: 'auto' }}>
                    <Header as='h3' 
                            dividing >
                        Dane dodanej piosenki
                    </Header>

                    <Segment vertical >
                        <Form>
                            <Input className="link-input"
                                   label={{ basic: true, content: 'ID:' }}
                                   labelPosition='left'
                                   value={addedSong.AddedSongId} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Użytkownik:' }}
                                   labelPosition='left'
                                   value={addedSong.User} /> 
                        
                            <Input className="link-input"
                                   label={{ basic: true, content: 'Wykonawca:' }}
                                   labelPosition='left'
                                   value={addedSong.Performer} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Tytuł:' }}
                                   labelPosition='left'
                                   value={addedSong.Title} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Data:' }}
                                   labelPosition='left'
                                   value={addedSong.AddDate} /> 

                            <TextArea autoHeight 
                                      autoComplete="off" 
                                      autoCorrect="off" 
                                      autoCapitalize="off" 
                                      spellCheck="false" 
                                      value={addedSong.Text} 
                                      onChange={this.handleTextChange} style={{ minHeight: '390px', maxHeight: '390px', marginTop: '10px' }} />                   
                        </Form>
                    
                    </Segment>
                    <Segment vertical >
                        <div className="link-buttons">
                            <AcceptButton clicked={this.onApproveButtonHandler}
                                          loading={this.state.isApproving} />

                            <DeleteButton clicked={this.onDeleteButtonHandler}
                                          loading={this.state.isDeleting} />
                        </div>
                    </Segment>
                </div>
        )
    }
}

export default TextForm;