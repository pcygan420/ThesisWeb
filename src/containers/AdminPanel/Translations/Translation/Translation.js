import React, { Component } from 'react';
import { Form,
         Header,
         Input,
         Segment,
         TextArea } from 'semantic-ui-react';

import { get, post, remove } from '../../../../api/api.js'

import AcceptButton from '../../../../components/Buttons/AcceptButton.js'
import DeleteButton from '../../../../components/Buttons/DeleteButton.js'

class TextForm extends Component {
    
    state = {
        translation: { Id: '', User: '', Performer: '', Title: '', AddDate: '', Translation: '' },
        isApproving: false,
        isDeleting: false
    }

    componentWillMount() { 

        get('/Admin/GetTran/' + this.props.location.state.id).then(data => {
            this.setState({ translation: data[0] })
        })
    }

    onApproveButtonHandler = () => {

        this.setState({ isApproving: !this.state.isApproving })
        post('/Admin/ApproveTran/' + this.state.translation.Id, {}).then(response => {

            this.setState({ isApproving: !this.state.isApproving })
            this.props.history.goBack()
            this.props.notification('Accept')
        })
    }

    onDeleteButtonHandler = () => {

        this.setState({ isDeleting: !this.state.isDeleting })
        remove('/Admin/DeleteTran/' + this.state.translation.Id).then(response => {

            this.setState({ isDeleting: !this.state.isDeleting })
            this.props.history.goBack()
            this.props.notification('Delete')
        })
    }

    render() {

        const { translation } = this.state;

        return(
            <div className="link-form" style={{ maxWidth: '600px', padding: '0' }}>
                    <Header as='h2' 
                            content='Dane podstawowe'
                            dividing/>

                    <Segment vertical>
                        <Form>
                            <Input className="link-input"
                                   label={{ basic: true, content: 'ID:' }}
                                   labelPosition='left'
                                   value={translation.Id} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Użytkownik:' }}
                                   labelPosition='left'
                                   value={translation.User} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Wykonawca:' }}
                                   labelPosition='left'
                                   value={translation.Performer} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Tytuł:' }}
                                   labelPosition='left'
                                   value={translation.Title}/> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Data:' }}
                                   labelPosition='left'
                                   value={translation.AddDate} /> 

                            <TextArea autoHeight 
                                      autocomplete="off" 
                                      autocorrect="off" 
                                      autocapitalize="off" 
                                      spellcheck="false" 
                                      value={translation.Translation} 
                                      onChange={this.handleTextChange} 
                                      style={{ minHeight: 350, maxHeight: 500, marginTop: '10px', whiteSpace: 'pre-wrap' }} />
                            
                        </Form>
   
                    </Segment>
                    <Segment vertical>
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