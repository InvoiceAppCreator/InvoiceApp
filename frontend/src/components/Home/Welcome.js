import React, { Component } from 'react'
import Buttons from './Buttons'

function Welcome(props) {

      return (
          <div className='home-welcome'>
              <h1 id='welcome-header'>Welcome, {props.user}</h1>
              <Buttons/>
          </div>
      )
}

export default Welcome
