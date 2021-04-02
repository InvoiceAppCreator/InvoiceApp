import React, { Component } from 'react'
import './Invoices.css'
import image from '../Quotes/Images/sampleFace2.png'

class User extends Component {
    render() {
        return (
            <div className='invoices-user'>
              <img src={image}/>
              <hr id='user-line'></hr>
              <p>Diana Rouloff</p>
              <p>Diana.Rouloff@gmail.com</p>
            </div>
        )
    }
}

export default User
