import React, { Component } from 'react'
import Nav from '../components/Login/Nav.js'
import LoginBody from '../components/Login/LoginBody'

export class Login extends Component {
    render() {
        return (
            <div>
               <Nav/>
               <LoginBody/>
            </div>
        )
    }
}

export default Login
