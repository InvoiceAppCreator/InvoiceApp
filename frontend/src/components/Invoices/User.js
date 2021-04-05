import React, { Component } from 'react'
import './Invoices.css'
import image from '../Quotes/Images/sampleFace3.png'

class User extends Component {
    render() {
        return (
            <div className='invoices-user'>
              <img src={image}/>
              <hr id='user-line'></hr>
              <p>{document.cookie.split(';')[0].split('=')[1]}</p>
              <p>{`${document.cookie.split(';')[0].split('=')[1]}@gmail.com`}</p>
            </div>
        )
    }
}

export default User
