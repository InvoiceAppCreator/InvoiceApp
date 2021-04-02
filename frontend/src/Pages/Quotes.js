import React, { Component } from 'react'
import Nav from '../components/Quotes/Nav'
import User from '../components/Quotes/User'
import QuotesTable from '../components/Quotes/QuotesTable'

export class Quotes extends Component {
    render() {
        return (
            <div>
               <Nav/>
               <User/>
               <QuotesTable/>
            </div>
        )
    }
}

export default Quotes
