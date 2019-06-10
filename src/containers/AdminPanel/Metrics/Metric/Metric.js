import React, { Component } from 'react';
import { Form,
         Header,
         Input,
         Segment } from 'semantic-ui-react';

import { get, post, remove } from '../../../../api/api.js'

import AcceptButton from '../../../../components/Buttons/AcceptButton.js'
import DeleteButton from '../../../../components/Buttons/DeleteButton.js'

class MetricForm extends Component {
    
    state = {
        metric: { MetricId: '', User: '', Performer: '', Title: '', Album: '', Duration: '', PublicationDate: '', Curiosities: '', Tags: '', AddDate: '' },
        isApproving: false,
        isDeleting: false
    }

    componentWillMount() { 

        this.loadData();
    }

    onApproveButtonHandler = () => {

        this.setState({ isApproving: !this.state.isApproving })
        post('/Admin/ApproveMetric/' + this.state.metric.MetricId, {}).then(response => {

            this.setState({ isApproving: !this.state.isApproving })
            this.props.history.goBack()
            this.props.notification('Accept')
        })
    }

    onDeleteButtonHandler = () => {

        this.setState({ isDeleting: !this.state.isDeleting })
        remove('/Admin/DeleteMetric/' + this.state.metric.MetricId).then(response => {

            this.setState({ isDeleting: !this.state.isDeleting })
            this.props.history.goBack()
            this.props.notification('Delete')
        })
    }

    loadData = () => {
        get('/Admin/GetAddedMetric/' + this.props.location.state.id).then(data => {
            this.setState({ metric: data[0] })
        })
    }

    render() {

        const { metric } = this.state;

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
                                   value={metric.MetricId} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Użytkownik:' }}
                                   labelPosition='left'
                                   value={metric.User} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Wykonawca:' }}
                                   labelPosition='left'
                                   value={metric.Performer} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Tytuł:' }}
                                   labelPosition='left'
                                   value={metric.Title}/> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Album:' }}
                                   labelPosition='left'
                                   value={metric.Album} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Długość:' }}
                                   labelPosition='left'
                                   value={metric.Duration} /> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Data wydania:' }}
                                   labelPosition='left'
                                   value={metric.PublicationDate}/> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Ciekawostki:' }}
                                   labelPosition='left'
                                   value={metric.Curiosities}/> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Gatunki:' }}
                                   labelPosition='left'
                                   value={metric.Tags}/> 

                            <Input className="link-input"
                                   label={{ basic: true, content: 'Data:' }}
                                   labelPosition='left'
                                   value={metric.AddDate} />                           
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

export default MetricForm;