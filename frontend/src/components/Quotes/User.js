import React from 'react'
import './Quotes.css'
import image from './Images/sampleFace2.png'
import {useCookies} from 'react-cookie';

function User() {

    return (
        <div className='quotes-user'>
          <img src={image}/>
          <hr id='user-line'></hr>
          <p>{document.cookie.split('=')[1]}</p>
          <p>{`${document.cookie.split('=')[1]}@gmail.com`}</p>
        </div>
    )
}

export default User
