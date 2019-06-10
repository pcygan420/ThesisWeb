import React, { Component } from 'react';
import { Button,
         Container,       
         Form,
         Icon,
         Message, 
         Segment } from 'semantic-ui-react';

import axios from 'axios' 
import { withRouter, NavLink } from "react-router-dom";

/* STYLES */
import "../Form.css";

class LoginForm extends Component {

    state = {
        userName: '',
        password: '',
        userNameError: '',
        passwordError: '',
        loginError: '',
        isLoading: false
    }

    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value}) 

    validate() {
        var userNameValid = this.validateForm('userName');
        var passValid = this.validateForm('password');

        this.setState({ userNameError: !userNameValid ? 'Nieprawidłowa nazwa użytkownika.' : '', 
                        passwordError: !passValid ? 'Hasło nie może być puste.' : '' })

        if(userNameValid && passValid)
            return true;
        else
            return false;
    }

    validateForm(field) {

        let re = ''
        switch(field) {
            case 'userName':
                re = /^(?!\s*$).+/;// /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const { userName } = this.state;
                return re.test(String(userName));
            case 'password':
                re = /^(?!\s*$).+/;
                const { password } = this.state;
                return re.test(String(password));
            
            default:
                return;
        }
    }

    onLoginHandler = () => {

        this.setState({ loginError: '' })

        if(!this.validate())
            return;

        let data = {
            grant_type: "password",
            userName: this.state.userName,
            password: this.state.password
        }

        this.setState({ isLoading: true })
        this.props.onAuth();
        axios.post('/Token',Object.keys(data).map(function(key) { return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) }).join('&'), { headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }}).then(response => {
            this.setState({ isLoading: false })

            localStorage.setItem('roles', response.data.userRole)
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('userName', this.state.userName)

            

            if(response.data.userRole.includes('Admin'))
                this.props.history.push('/admin/przeglad')
            else 
                this.props.history.push('/')
            
        })
        .catch(error => {
            /* not correct login data */
            this.setState({ isLoading: false })
            this.setState({ loginError: 'Nieprawidłowy login lub hasło.' })
        })
    }

    render() {

        const { isLoading,
                loginError,
                password,
                passwordError,
                userName,
                userNameError } = this.state;

        return(
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>    
                <div className="form-wrapper">
                    <div className="form-container">                       
                        <Segment stacked
                                 style={{ padding: '0' }}>

                            <Message attached
                                     header='Zaloguj się'
                                     content='Zaloguj się by dodawać, edytować, oceniać piosenki i otrzymywać punkty.' />

                            <Form size="large" >
                                    
                                <Form.Field>
                                    <Form.Input name='userName' 
                                                icon='user'
                                                iconPosition='left'
                                                label='Nazwa użytkownika' 
                                                error={ loginError === '' && userNameError === '' ? false : true } 
                                                value={userName} 
                                                onChange={this.onInputChangeHandler}/>

                                    {<div className='error-message'>{userNameError}</div>}
                                </Form.Field>

                                <Form.Field>
                                    <Form.Input name='password' 
                                                icon='lock'
                                                iconPosition='left'
                                                label='Hasło' 
                                                type="password" 
                                                error={ loginError === '' && passwordError === '' ? false : true } 
                                                value={password}
                                                onChange={this.onInputChangeHandler}/>

                                    {<div hidden={passwordError === ''} className='error-message'>{passwordError}</div>}
                                </Form.Field>

                                {<div hidden={loginError === ''} className='error-message'>{loginError}</div>}

                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <Button fluid
                                            loading={isLoading}
                                            type='submit' 
                                            color="blue" 
                                            size='large' 
                                            onClick={this.onLoginHandler}
                                            style={{ margin: '30px 0 10px 0' }}>Zaloguj</Button>
                                </div>
                            </Form>  
                        </Segment>                                             
                    </div>

                    <Message info>
                        <Icon name='info' />
                        Jesteś nowy? <NavLink to='/konto/rejestracja'> Zarejestruj się</NavLink>.
                    </Message>
                </div>
            </Container>
        )
    }
}

export default withRouter(LoginForm);