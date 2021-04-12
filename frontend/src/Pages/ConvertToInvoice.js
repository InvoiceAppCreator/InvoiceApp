import React, {Component} from 'react'
import '../components/Quotes/ConvertToInvoice.css'
import CreateConvertTable from '../components/Quotes/CreateConvertTable'
import axios from 'axios'

class ConvertToInvoice extends Component {

  constructor(props) {
    super(props)
    this.state = {

      searchData : [],

      quoteNumber: '',
      invoiceNumber: '',
      customer: '',
      createdDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      expectedDate: '',
      total: 0.00,
      status: '',

      itemCode : [],
      description: [],
      quantity: [],
      unitPrice: [],
      totalPrice: [],
      delete: [],

      partID: 0,
      partData: [],
    }
  }

  addPart = () => {
    this.state.partData.push(<CreateConvertTable partKey={this.state.partID}/>)
    this.setState({
      partID : this.state.partID + 1
    })
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/part-search/${document.cookie.split(';')[0].split('=')[1]}`).then(res => {
      this.setState({
        searchData : res.data
      })
    })
  }


  changeQuoteNumber = (event) =>
  {
    this.setState({
      quoteNumber: event.target.value
    }, () => {
      this.state.searchData.filter((x) => {
        this.setState({
          partData: [],
          total: 0,
          customer: '',
          status: 'Pending',
        })
        if (this.state.quoteNumber === '') {

        } else if (x.quoteNumber.includes(this.state.quoteNumber)) {
          if (this.state.quoteNumber === x.quoteNumber) {
            axios.get(`http://localhost:8000/api/parts/${document.cookie.split(';')[0].split('=')[1]}`).then(res => {
              this.state.partData.pop()
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].partQuoteNumber === x.quoteNumber) {
                  this.state.itemCode.push(res.data[i].partModelNumber)
                  this.state.description.push(res.data[i].partDescription)
                  this.state.quantity.push(res.data[i].partQtyCommitted)
                  this.state.unitPrice.push(res.data[i].partPrice)
                  this.state.totalPrice.push(res.data[i].partQtyCommitted * res.data[i].partPrice)

                  this.state.partData.push(<CreateConvertTable
                    partKey={this.state.partID}
                    itemCode={this.state.itemCode[this.state.partID]}
                    description={this.state.description[this.state.partID]}
                    quantity={this.state.quantity[this.state.partID]}
                    unitPrice={this.state.unitPrice[this.state.partID]}
                    total={this.state.totalPrice[this.state.partID]}/>
                  )

                  this.setState({
                    partID: this.state.partID + 1,
                    total : this.state.total + this.state.totalPrice[this.state.partID],
                    customer : x.customer,
                    status: x.status
                  })
                }
              }
            })
          }
        }
        return 0
      })
    })
  }

  convertToInvoice = (event) => {

    for (var i = 0; i < this.state.partID; i++) {
      var invoicePartData = {
        'partInvoiceNumber': this.state.invoiceNumber,
        'itemCode': this.state.itemCode[i],
        'author': document.cookie.split(';')[0].split('=')[1],
        'description': this.state.description[i],
        'quantity': this.state.quantity[i],
        'unitPrice': this.state.unitPrice[i],
        'totalPrice': this.state.totalPrice[i],
      }
      axios.post(`http://localhost:8000/api/part-invoice/${document.cookie.split(';')[0].split('=')[1]}`, invoicePartData).then(res => {
        console.log(res)
      })
    }
    var invoiceData = {
      'author': document.cookie.split(';')[0].split('=')[1],
      'invoiceNumber': this.state.invoiceNumber,
      'customer': this.state.customer,
      'createdDate': this.state.createdDate,
      'dueDate': this.state.expectedDate,
      'totalDue': this.state.total,
      'status': this.state.status,
    }

    axios.post(`http://localhost:8000/api/invoiceList/${document.cookie.split(';')[0].split('=')[1]}`, invoiceData).then(res => {
      console.log(res)
      window.location.href = 'http://localhost:3000/quotes/'
    })
  }

  render() {
    return (
      <>
        <nav className='quotes-nav'>
            <h1 id='nav-header'>Convert to Invoice</h1>
        </nav>

        <div className='main-information-fill'>
          <label>Quote Number<input style={{'margin-left':'14px'}} type='text' placeholder="Quote Number to Convert" value={this.state.quoteNumber} onChange={this.changeQuoteNumber}/></label>
          <label style={{'margin-left':'20px'}}>Invoice Number<input style={{'margin-left':'16px'}} type='text' placeholder="Invoice Number" value={this.state.invoiceNumber} onChange={e => this.setState({invoiceNumber: e.target.value})}/></label>
          <label style={{'margin-left':'20px'}}>Customer<input style={{'margin-left':'16px'}} type='text' placeholder="Customer" value={this.state.customer} onChange={e => this.setState({customer: e.target.value})}/></label><br></br>
          <label>Created<input style={{'margin-left':'70px'}} type='text' placeholder="Date Created" value={this.state.createdDate} disabled/></label>
          <label style={{'margin-left':'20px'}}>Expected<input style={{'margin-left':'73px'}} type='text' placeholder='Expected Date' value={this.state.expectedDate} onChange={e => this.setState({expectedDate: e.target.value})}/></label>
          <label style={{'margin-left':'20px'}}>Total<input style={{'margin-left':'53.5px'}} type='text' placeholder='Total of All Parts' value={this.state.total.toFixed(2)} disabled/></label><br></br>
          <label>Status
            <select style={{'margin-left':'85px'}} value={this.state.status} onChange={e => {this.setState({status: e.target.value})}}>
              <option value={'Pending'}>Pending</option>
              <option value={'Paid'}>Paid</option>
            </select>
          </label>
        </div>

        <div className='adding-part-data'>
          <div className = 'adding-part-data-headers'>
            <table>
              <th className='invoice-convert-itemCode'>Item Code</th>
              <th className='invoice-convert-description'>Description</th>
              <th className='invoice-convert-quantity'>Quantity</th>
              <th className='invoice-convert-unitPrice'>Unit Price</th>
              <th className='invoice-convert-totalPrice'>Total Price</th>
            </table>
          </div>

          <div className = 'adding-part-data-table'>
            <table contenteditable id='adding-part-data-table-actualTable'>
            {
              this.state.partData.map(x => {
                try {
                  return x
                } catch (e){

                }
                return 0
              })
            }
            </table>
          </div>

          <div id='save-add-delete'>
            <button style={{width:'100%'}} onClick={this.convertToInvoice}>Convert to Invoice</button>
          </div>
        </div>
      </>
    )
  }
}

export default ConvertToInvoice
