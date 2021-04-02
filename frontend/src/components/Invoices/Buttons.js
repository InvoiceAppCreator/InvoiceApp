import React, { Component } from 'react'
import './Invoices.css'
import image from '../Home/Images/SunBackground.jpg'

class Buttons extends Component {
    render() {
        return (
            <div className='invoices-buttons'>
              <div id='buttons-background-image'>
                <img src={image}/>
              </div>
              <div id='buttons-function-buttons'>
                <button id='button-functions-buttons-create'>Create</button>
                <button>Export</button>
                <button id='button-functions-buttons-import'>Import</button>
              </div>
            </div>
        )
    }
}

export default Buttons
