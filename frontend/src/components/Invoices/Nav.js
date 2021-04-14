import React, { Component } from 'react'
import './Invoices.css'

class Nav extends Component {
    render() {
        return (
            <nav className='invoices-nav'>
                <h1 id='nav-header'>Invoices</h1>
                <div style={{'margin-left':'64.86%'}} id='nav-nav'>
                  <p><a href='/quotes'>Quotes&nbsp;</a> <a>|&nbsp;</a> <a href='/home'>Home&nbsp;</a> <a>|&nbsp;</a> <a>Settings&nbsp;</a> <a>|&nbsp;</a> <a href='/logout'>Logout&nbsp;</a></p>
                </div>
            </nav>
        )
    }
}
export default Nav
