import React, { Component } from 'react'
import './Quotes.css'

class Nav extends Component {
    render() {
        return (
            <nav className='quotes-nav'>
                <h1 id='nav-header'>Quotes</h1>
                <div id='nav-nav'>
                  <p><a href='/invoices'>Invoices&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/home'>Home&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/settings'>Settings&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/logout'>Logout&nbsp;</a></p>
                </div>
            </nav>
        )
    }
}

export default Nav
