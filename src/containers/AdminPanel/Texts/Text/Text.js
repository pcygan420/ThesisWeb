import React, { Component } from 'react';
import { Button,
         Form,
         Header,
         Input,
         Segment,
         TextArea } from 'semantic-ui-react';

import { get, post, remove } from '../../../../api/api.js'

class TextForm extends Component {
    
    state = {
        text: { Id: '', User: '', Text: '', Performer: '', AddDate: '', Title: ''},
        isApproving: false,
        isDeleting: false
    }

    componentWillMount() { 
        this.loadData();
    }

    onApproveButtonHandler = () => {

        this.setState({ isApproving: !this.state.isApproving })
        post('/Admin/ApproveText/' + this.state.text.Id, {}).then(response => {

            this.setState({ isApproving: !this.state.isApproving })
            this.props.history.goBack()
            this.props.notification('Approve')
        })
    }

    onDeleteButtonHandler = () => {

        this.setState({ isDeleting: !this.state.isDeleting })
        remove('/Admin/DeleteText/' + this.state.text.Id).then(response => {

            this.setState({ isDeleting: !this.state.isDeleting })
            this.props.history.goBack()
            this.props.notification('Delete')
        })
    }

    loadData = () => {
        get('/Admin/GetText/' + this.props.location.state.id).then(data => {
            this.setState({ text: data })
        })
    }

    render() {

        const { text } = this.state;

        return(
            <div className="link-form" style={{ maxWidth: '600px', margin: 'auto' }}>
                    <Header as='h2' dividing style={{ height: '45px' }}>
                        Dane podstawowe
                    </Header>

                    <Segment vertical>
                        <Form>
                            <Input className="link-input"
                                   label={{ basic: true, content: 'ID:' }}
                                   labelPosition='left'
                                   value={text.Id} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Użytkownik:' }}
                                   labelPosition='left'
                                   value={text.User} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Wykonawca:' }}
                                   labelPosition='left'
                                   value={text.Performer} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Tytuł:' }}
                                   labelPosition='left'
                                   value={text.Title}/> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Data:' }}
                                   labelPosition='left'
                                   value={text.AddDate} /> 

                            <TextArea autoHeight 
                                      autoComplete="off" 
                                      autoCorrect="off" 
                                      autoCapitalize="off" 
                                      spellCheck="false" 
                                      value={text.Text} 
                                      onChange={this.handleTextChange} 
                                      style={{ minHeight: 350, marginTop: '10px', whiteSpace: 'pre-wrap' }} />
                            
                        </Form>
   
                    </Segment>
                    <Segment vertical>
                        <div className="link-buttons">
                            <Button color='blue'
                                    loading={this.state.isApproving}
                                    onClick={this.onApproveButtonHandler}> Zatwierdź
                            </Button>

                            <Button color="grey"
                                    loading={this.state.isDeleting}
                                    className="link-button"
                                    onClick={this.onDeleteButtonHandler}> Odrzuć                    
                            </Button>
                        </div>
                    </Segment>
                </div>
        )
    }
}

export default TextForm;