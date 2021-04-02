import React, { Component } from 'react'
import Nav from '../components/Signup/Nav'
import SignupBody from '../components/Signup/SignupBody.js'

export class Signup extends Component {
    render() {
        return (
            <div>
               <Nav/>
               <SignupBody/>
            </div>
        )
    }
}

export default Signup
