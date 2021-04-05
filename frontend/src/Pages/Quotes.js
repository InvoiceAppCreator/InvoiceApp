import React, { Component } from 'react'
import Nav from '../components/Quotes/Nav'
import QuotesTable from '../components/Quotes/QuotesTable'

export class Quotes extends Component {
    render() {
        return (
            <div>
               <Nav/>
               <QuotesTable/>
            </div>
        )
    }
}

export default Quotes
