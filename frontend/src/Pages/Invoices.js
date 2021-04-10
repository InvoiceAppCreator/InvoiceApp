import React, { Component } from 'react'
import Nav from '../components/Invoices/Nav'
import InvoiceTable from '../components/Invoices/InvoiceTable'

export class Invoices extends Component {
    render() {
        return (
            <div>
              <Nav/>
              <InvoiceTable/>
            </div>
        )
    }
}

export default Invoices
