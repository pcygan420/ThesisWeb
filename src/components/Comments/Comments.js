import React, { Component } from 'react';
import { Button,
         Comment,
         Form,
         Header } from 'semantic-ui-react';

import { post } from '../../api/api.js'

import UserComment from './Comment/Comment.js'

class Comments extends Component {

    state = {
        isAuthenticated: false,
        comments: [],
        commentsTotal: 0,
        entity: null,
        isAdding: false,
        comment: '',
        error: ''
    }

    componentWillMount() {
        this.setState({ isAuthenticated: this.props.authenticated,
                        entity: this.props.entity,
                        comments: this.props.comments })
        
        var total = 0;

        for(var i = 0; i < this.props.comments.length; i++) {
            total += 1 + this.props.comments[i].Replies.length
        }

        this.setState({ commentsTotal: total })
        
    }

    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value})
    
    onCommentAddHandler = () => {
        
        if(this.state.comment === '') {
            this.setState({ error: 'To pole nie może być puste.' })
            return;
        }

        this.setState({ error: '' })

        var data = {
            EntityId: this.props.entity,
            UserName: localStorage.getItem('userName'),
            Text: this.state.comment
        }
        this.setState({ isAdding: true })

        post('/Song/AddComment', data).then(response => {
            
            this.setState({ isAdding: false, comment: '' })
        })        
    }

    render() {

        const { comment,comments,commentsTotal,isAdding,isAuthenticated,error } = this.state

        return(
            <Comment.Group style={{ marginTop: '20px', padding: '0', position: 'relative' }}>
                <Header as='h2' 
                        content={'Komentarze (' + commentsTotal + ')'}
                        dividing
                        style={{ height: '30px' }} />

                <div style={{ minHeight: '100px', lineHeight: '100px', position: 'relative' }}>
                    {   commentsTotal > 0 ?
                        Object.entries(comments).map( ([key,value],index) => { 
                            return <UserComment key={value} 
                                                id={value.CommentId}
                                                authenticated={isAuthenticated}
                                                user={value.UserName} 
                                                text={value.Text} 
                                                date={value.Date}
                                                replies={value.Replies} /> }) : <div style={{ color: 'rgba(0,0,0,.7)', 
                                                                                              width: '100%', 
                                                                                              textAlign: 'center' }}> Nie dodano jeszcze żadnego komentarza. </div>
                    }    
                </div>   
                
                <Form reply style={{ marginTop: '50px' }}>
                    <Header as='h3'
                            content='Twój komentarz'
                            style={{ marginBottom: '5px' }} />

                    <Form.TextArea name='comment'
                                   disabled={isAdding || !isAuthenticated}
                                   value={comment}
                                   onChange={this.onInputChangeHandler}
                                   placeholder='treść komentarza...'
                                   style={{ height: '10em' }}/>

                    { error !== '' ? <div className='error-message'> { error } </div> : null }

                    <Button primary 
                            content={'Dodaj komentarz'} 
                            disabled={isAdding || !isAuthenticated}
                            icon='edit' 
                            labelPosition='left' 
                            loading={isAdding}
                            size='small'
                            onClick={this.onCommentAddHandler} />             
                </Form>    
            </Comment.Group>
        )
    }
}

export default Comments;