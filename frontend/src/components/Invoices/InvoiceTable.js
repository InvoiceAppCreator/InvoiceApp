import React, { Component } from 'react'
import './Invoices.css'

class InvoiceTable extends Component {
    render() {
        return (
            <div className='invoices-invoicesTable'>
              <div id='invoicesTable-table'>
                <div id='invoicesTable-table-headers'>
                  <table>
                    <tr>
                      <th id='invoiceNumber'>Invoice Number</th>
                      <th id='invoice-customer'>Customer</th>
                      <th id='invoice-created'>Created</th>
                      <th id='invoice-due-date'>Due Date</th>
                      <th id='invoice-total-due'>Total Due</th>
                      <th id='invoice-status'>Status</th>
                    </tr>
                  </table>
                </div>
                <div id='invoicesTable-table-table'>
                  <table>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                    <tr>
                      <td id='invoiceNumber'>S0001</td>
                      <td id='invoice-customer'>Amy Adams</td>
                      <td id='invoice-created'>03/24/15</td>
                      <td id='invoice-due-date'>03/25/15</td>
                      <td id='invoice-total-due'>$3.12</td>
                      <td id='invoice-status'>Pending</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div id='invoicesTable-buttons'>
                <button id='invoicesTable-buttons-search'>Search</button>
                <button>Edit</button>
                <button id='invoicesTable-buttons-delete'>Delete</button>
              </div>
            </div>
        )
    }
}

export default InvoiceTable
