import React, { Component } from 'react';
import { Button,
         Comment,
         Form, } from 'semantic-ui-react';

import { post } from '../../../api/api.js'

import avatar from '../../../assets/Images/avatar.png'

import './Comment.css'

class UserComment extends Component {

    state = {
        replyShow: false,
        reply: '',
        addingReply: false,
        error: ''
    }

    /* INPUT CHANGE */
    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value})

    onToggleShowReply = () => { 
        if(!this.props.authenticated)
            return;
            
        this.setState({ replyShow: !this.state.replyShow }) 
    }
    
    onAddReplyHandler = () => {

        const { reply } = this.state;

        if(reply === '') {
            this.setState({ error: 'To pole nie może być puste.' })
            return;
        }

        this.setState({ error: '' })    

        var data = {
            ParentId: this.props.id,
            Comment: reply
        }
        
        this.setState({ addingReply: true })
        
        post('/Song/AddReply', data).then(response => {
            this.setState({ addingReply: false, reply: '' })
        })
    }

    render() {

        const { reply,addingReply,error } = this.state;

        const replyFormStyle = this.state.replyShow === false ? '0px' : '140px';

        return(
            <Comment>
                <Comment.Avatar src={avatar} />
                <Comment.Content>
                    <Comment.Author as='a'> {this.props.user} </Comment.Author>
                        <Comment.Metadata>
                            <div>{this.props.date}</div>
                        </Comment.Metadata>
                        <Comment.Text>
                            {this.props.text}
                        </Comment.Text>
                        <Comment.Actions>
                            <Comment.Action as='a' 
                                            onClick={this.onToggleShowReply}
                                            active={this.state.replyShow}> Odpowiedz </Comment.Action>
                        </Comment.Actions>

                        {/* Replies */}
                        <Comment.Group>
                            {
                                Object.entries(this.props.replies).map( ([key,value],index) => {
                                     return <Comment>
                                                <Comment.Avatar src={avatar} />
                                                <Comment.Content>
                                                    <Comment.Author as='a'> {value.User} </Comment.Author>
                                                    <Comment.Metadata>
                                                    <div>{value.Date}</div>
                                                    </Comment.Metadata>
                                                    <Comment.Text>{value.Comment}</Comment.Text>
                                                </Comment.Content>
                                            </Comment>
                                })
                            }
                        </Comment.Group>

                        {/* Form */}
                        <Form reply 
                              className="comment-reply" 
                              style={{ height: replyFormStyle }}>
                            <Form.TextArea name='reply'
                                           disabled={addingReply}
                                           value={reply}
                                           onChange={this.onInputChangeHandler}/>

                            { error !== '' ? <div className='error-message'> { error } </div> : null }

                            <Button primary
                                    content='Dodaj odpowiedź'
                                    disabled={addingReply}
                                    icon='edit' 
                                    labelPosition='left'
                                    loading={addingReply}
                                    size='tiny'
                                    onClick={this.onAddReplyHandler} />
                        </Form>
                </Comment.Content>
            </Comment>
        )
    }
}

export default UserComment;