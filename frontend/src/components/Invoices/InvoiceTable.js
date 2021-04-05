import React, { Component } from 'react'
import './Invoices.css'
import axios from 'axios'
import TableTemplate from './TableTemplate'
import image from '../Home/Images/SunBackground.jpg'

class InvoiceTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/invoiceList/${document.cookie.split(';')[0].split('=')[1]}`)
    .then(res => {
      this.setState({data:res.data})
    })
  }

  createInvoice = (event) => {
    window.location.href = 'http://localhost:3000/invoices/create-invoice'
  }


  render() {
    return (
      <>
        <div className='invoices-buttons'>
          <div id='buttons-background-image'>
            <img src={image}/>
          </div>
          <div id='buttons-function-buttons'>
            <button id='button-functions-buttons-create' onClick={this.createInvoice}>Create</button>
            <button>Export</button>
            <button id='button-functions-buttons-import'>Import</button>
          </div>
        </div>

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
              {
                this.state.data.map(info => <TableTemplate invoiceNumber={info.invoiceNumber}
                                                          customer={info.customer}
                                                          createdDate={info.createdDate}
                                                          dueDate={info.dueDate}
                                                          totalDue={info.totalDue}
                                                          status={info.status ? 'Paid' : 'Pending'}/>)
              }
              </table>
            </div>
          </div>
          <div id='invoicesTable-buttons'>
            <button id='invoicesTable-buttons-search'>Search</button>
            <button>Edit</button>
            <button id='invoicesTable-buttons-delete'>Delete</button>
          </div>
        </div>
      </>
    )
  }
}

export default InvoiceTable
