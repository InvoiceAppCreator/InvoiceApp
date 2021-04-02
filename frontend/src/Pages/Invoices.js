import React, { Component } from 'react'
import Nav from '../components/Invoices/Nav'
import User from '../components/Invoices/User'
import Buttons from '../components/Invoices/Buttons'
import InvoiceTable from '../components/Invoices/InvoiceTable'

export class Invoices extends Component {
    render() {
        return (
            <div>
              <Nav/>
              <User/>
              <Buttons/>
              <InvoiceTable/>
            </div>
        )
    }
}

export default Invoices
