import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'

import { Button,
         Checkbox,
         Container,
         Form,
         Icon,  
         Message,
         Segment } from 'semantic-ui-react';

import { post } from '../../../../api/api.js'

/* STYLES */
import '../Form.css';

/* COMPONENTS */
import SuccessLog from '../../../../components/Messages/Register/RegisterComplete.js'

class RegisterForm extends Component {

    state = {
        username: '',
        sex: '',
        email: '',
        password: '',
        confirmpass: '',
        showPass: false,
        about: '',
        usernameError: '',
        sexError: '',
        emailError: '',
        passwordError: '',
        confirmpassError: '',
        serverError: '',
        successLogShow: false,
        isLoading: false
    }

    validate() {
        var emailValid = this.validateForm('email');
        var passValid = this.validateForm('password');
        var confirmpassValid = this.validateForm('confirmpass')
        var usernameValid = this.validateForm('username')
        var sexValid = this.validateForm('sex')

        this.setState({ emailError: !emailValid ? 'Nieprawidłowy email.' : ''})
        this.setState({ passwordError: !passValid ? 'Hasło musi składać się przynajmniej z 1 małej liter, 1 dużej litery, 1 cyfry i 1 znaku specjalnego.' : '' })
        this.setState({ usernameError: !usernameValid ? 'Nazwa użytkownika musi mieć przynajmniej 6 znaków długości i nie więcej niż 32.' : '' })
        this.setState({ sexError: !sexValid ? 'Wybierz płeć.' : '' })

        /* are password and confirm password equal */
        var passwordsValid = (this.state.password === this.state.confirmpass && passValid);

        if(!passwordsValid) 
            this.setState({ confirmpassError: 'Wpisane hasła muszą być takie same.' })
        

        if(emailValid && passValid && confirmpassValid && usernameValid && sexValid && passwordsValid)
            return true;
        else
            return false;
    }

    validateForm(field) {

        let re = ''
        switch(field) {
            case 'username':
                re = /^([a-zA-Z0-9@*#]{6,32})$/;
                const { username } = this.state
                return re.test(String(username));
            case 'sex':
                const { sex } = this.state
                return (sex === 'm' || sex === 'f');
            case 'email':
                re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const { email } = this.state;
                return re.test(String(email));
            case 'password':
                re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&`])[A-Za-z\d@$!%*?&]{8,}$/;
                const { password } = this.state;
                return re.test(String(password));
            case 'confirmpass':
                re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&`])[A-Za-z\d@$!%*?&]{8,}$/;
                const { confirmpass } = this.state;
                return re.test(String(confirmpass));
            default:
                return;
        }
    }

    onInputChangeHandler = e => this.setState({ [e.target.name]: e.target.value}) 

    onSexChangeHandler = (e, { sex }) => this.setState({ sex })

    onShowPassHandler = () => this.setState({ showPass: !this.state.showPass })
    
    onRegisterHandler = () => {    

        if(!this.validate())
            return;

        const { username,email,password,confirmpass,sex } = this.state;

        let data = JSON.stringify({
            UserName: username,
            Email: email,
            Password: password,
            ConfirmPassword: confirmpass,
            Sex: sex
        })

        this.setState({ isLoading: true })

        post('/api/Account/Register',data).then(response => {
            this.setState({ successLogShow: true, isLoading: false })
        }).catch(error => {
            var errorMassages = error.response.data.ModelState
            this.setState({ serverError: Object.values(errorMassages),
                            isLoading: false })
        })
    }

    toggleMessage = () => {
        const currentValue = this.state.successLogShow;
        this.setState({ successLogShow: !currentValue })
    }

    render() {

        const { usernameError, sexError, emailError, passwordError, confirmpassError, serverError, isLoading,successLogShow } = this.state;

        return (
            <Container fluid style={{maxWidth: '1920px', padding: '0'}}>    
                <div className="form-wrapper">
                    <div className="form-container">


                        { successLogShow ? <SuccessLog toggle={this.toggleMessage }/> : (
                            <Segment stacked
                                    style={{ padding: '0' }}>

                                <Message attached
                                        header='Załóż konto'
                                        content='Załóż konto by podejmować różne aktywności na stronie.' />
                         
                                    <Form size='large'>

                                        <Form.Field>
                                            <Form.Input name='username'
                                                        icon='user'
                                                        iconPosition='left'
                                                        label='Nazwa użytkownika'
                                                        error={usernameError === '' ? false : true }
                                                        value={this.state.username}
                                                        onChange={this.onInputChangeHandler} />

                                            {<div hidden={usernameError === ''} className='error-message'>{usernameError}</div>}
                                        </Form.Field>

                                        <Form.Group inline>
                                            <label>Płeć</label>
                                            <Form.Radio label='Mężczyzna'
                                                        sex='m'
                                                        checked={this.state.sex === 'm'}
                                                        onChange={this.onSexChangeHandler}></Form.Radio>
                                            <Form.Radio label='Kobieta'
                                                        sex='f'
                                                        checked={this.state.sex === 'f'}
                                                        onChange={this.onSexChangeHandler}></Form.Radio>

                                            {<div hidden={sexError === ''} className='error-message' style={{ margin: '0px 5px' }}>{sexError}</div>}
                                        </Form.Group>

                                        <Form.Field>
                                            <Form.Input name='email'
                                                        icon='at'
                                                        iconPosition='left'
                                                        label='Email'
                                                        error={emailError === '' ? false : true }
                                                        value={this.state.email}
                                                        onChange={this.onInputChangeHandler} />

                                            {<div hidden={emailError === ''} className='error-message'>{emailError}</div>}
                                        </Form.Field>

                                        <Form.Field>
                                            <Form.Input name='password'
                                                        icon='lock'
                                                        iconPosition='left' 
                                                        label='Hasło' 
                                                        type={this.state.showPass ? '' : 'password'}
                                                        error={passwordError === '' ? false : true }
                                                        value={this.state.password}
                                                        onChange={this.onInputChangeHandler} />

                                            {<div hidden={passwordError === ''} className='error-message'>{passwordError}</div>}
                                        </Form.Field>

                                        <Form.Field>
                                            <Form.Input name='confirmpass'
                                                        icon='lock'
                                                        iconPosition='left'
                                                        label='Powtórz hasło' 
                                                        type={this.state.showPass ? '' : 'password'}
                                                        error={confirmpassError === '' ? false : true }
                                                        value={this.state.confirmpass}
                                                        onChange={this.onInputChangeHandler} />

                                            {<div hidden={confirmpassError === ''} className='error-message'>{confirmpassError}</div>}
                                        </Form.Field>

                                        <Form.Field>
                                            <Checkbox label='Pokaż hasło' checked={this.state.showPass} onChange={this.onShowPassHandler}/>
                                        </Form.Field>

                                        <Message error
                                                 header='List błędów:'
                                                 list={serverError} />

                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <Button fluid
                                                    color='blue'
                                                    loading={isLoading}
                                                    size='large' 
                                                    onClick={this.onRegisterHandler}>Zarejestruj</Button>
                                        </div>
                                    </Form>
                                </Segment> )  }
                    </div>
                    <Message info>
                        <Icon name='info' />
                        Masz konto? <NavLink to='/konto/logowanie'> Zaloguj się</NavLink>.
                    </Message>

                </div>

            </Container>
        )
    }
}

export default RegisterForm;