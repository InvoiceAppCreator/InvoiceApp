import React, { Component } from 'react'
import Nav from '../components/Invoices/Nav'
import User from '../components/Invoices/User'
import InvoiceTable from '../components/Invoices/InvoiceTable'

export class Invoices extends Component {
    render() {
        return (
            <div>
              <Nav/>
              <User/>
              <InvoiceTable/>
            </div>
        )
    }
}

export default Invoices
