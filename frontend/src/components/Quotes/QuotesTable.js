import React, { useState, useEffect, Component} from 'react'
import TableTemplate from './TableTemplate'
import './Quotes.css'
import image from '../Home/Images/SunBackground.jpg'
import axios from 'axios'

class QuotesTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  createQuote = (event) => {
    window.location.href = 'http://localhost:3000/quotes/create-quote'
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/quoteList/${document.cookie.split('=')[1]}`)
    .then(res => {
      this.setState({data:res.data})
    })
  }


  render() {
    return (
      <>
        <div className='quotes-buttons'>
          <div id='quotes-buttons-background-image'>
            <img src={image}/>
          </div>
          <div id='quotes-buttons-function-buttons' >
            <button id='quotes-button-functions-buttons-create' onClick={this.createQuote}>Create</button>
            <button>To Invoice</button>
            <button>Export</button>
            <button id='quotes-button-functions-buttons-import'>Import</button>
          </div>
        </div>

        <div className='quotes-quotesTable'>
          <div id='quotesTable-table'>
            <div id='quotesTable-table-headers'>
              <table>
                <tr>
                  <th id='quoteNumber'>Quote Number</th>
                  <th id='createDate'>Created Date</th>
                  <th id='expectDate'>Expected Date</th>
                  <th id='customers'>Customers</th>
                  <th id='salesperson'>Salesperson</th>
                  <th id='company'>Company</th>
                  <th id='total'>Total</th>
                  <th id='status'>Status</th>
                </tr>
              </table>
            </div>
            <div id='quotesTable-table-table'>
              <table>
              {
                this.state.data.map(info => <TableTemplate quoteNumber={info.quoteNumber}
                                                          createdDate={info.createdDate}
                                                          expectedDate={info.expectedDate}
                                                          customer={info.customer}
                                                          salesperson={info.salesperson}
                                                          company={info.company}
                                                          total={info.total}
                                                          status={info.status ? 'Done' : 'Order'}/>)
              }
              </table>
            </div>
          </div>
          <div id='quotesTable-buttons'>
            <button id='quotesTable-buttons-search'>Search</button>
            <button>Edit</button>
            <button id='quotesTable-buttons-delete'>Delete</button>
          </div>
        </div>
      </>
    )
  }

}

export default QuotesTable
