import React, {Component} from 'react'
import CreateInvoiceTable from '../components/Invoices/CreateInvoiceTable'
import axios from 'axios'

class CreateInvoice extends Component {

  constructor(props) {
    super(props)
    this.state = {
      invoiceNumber: '',
      customer: '',
      total: '',
      createdDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      dueDate: '',
      status: false,

      itemCode: [],
      description: [],
      quantity: [],
      unitPrice: [],
      totalPrice: [],
      delete: [],

      partID: 1,
      partData: [<CreateInvoiceTable partKey={0}/>]
    }
  }

  addPart = () => {
    this.state.partData.push(<CreateInvoiceTable partKey={this.state.partID}/>)
    this.setState({
      partID : this.state.partID + 1
    })
  }

  deleteSelected =() => {
    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`invoice-create-delete${i}`) !== null) {
        if (document.getElementById(`invoice-create-delete${i}`).checked) {
          document.getElementById(`invoice-create-delete${i}`).checked = false;
          var arr = this.state.partData
          arr[i] = ''
          this.setState({partData: arr})
          console.log("Deleting..." + i)
        } else {
          continue
        }
      }
    }
  }

  createInvoice = () => {
    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`invoice-convert-itemCode${i}`) !== null &&
      document.getElementById(`invoice-convert-description${i}`) !== null &&
      document.getElementById(`invoice-convert-quantity${i}`) !== null &&
      document.getElementById(`invoice-convert-unitPrice${i}`) !== null &&
      document.getElementById(`invoice-convert-totalPrice${i}`) !== null) {
        this.state.itemCode.push(document.getElementById(`invoice-convert-itemCode${i}`).innerHTML)
        this.state.description.push(document.getElementById(`invoice-convert-description${i}`).innerHTML)
        this.state.quantity.push(document.getElementById(`invoice-convert-quantity${i}`).innerHTML)
        this.state.unitPrice.push(document.getElementById(`invoice-convert-unitPrice${i}`).innerHTML)
        this.state.totalPrice.push(document.getElementById(`invoice-convert-totalPrice${i}`).innerHTML)

        var info = {
          'partInvoiceNumber' : this.state.invoiceNumber,
          'itemCode': this.state.itemCode[i],
          'author' :  document.cookie.split(';')[0].split('=')[1],
          'description' : this.state.description[i],
          'quantity' : this.state.quantity[i],
          'unitPrice' : this.state.unitPrice[i],
          'totalPrice' : this.state.totalPrice[i],
        }

        axios.post(`http://localhost:8000/api/part-invoice/${document.cookie.split(';')[0].split('=')[1]}`, info).then(res => {
          console.log(res)
        })
      }
    }

    var invoiceData = {
      'author': document.cookie.split(';')[0].split('=')[1],
      'invoiceNumber': this.state.invoiceNumber,
      'customer': this.state.customer,
      'createdDate': this.state.createdDate,
      'dueDate': this.state.createdDate,
      'totalDue': this.state.dueDate,
      'status': this.state.status,
    }
    axios.post(`http://localhost:8000/api/invoiceList/${document.cookie.split(';')[0].split('=')[1]}`, invoiceData).then(res => {
      console.log(res)
      window.location.href = 'http://localhost:3000/invoices/'
    })
}

  render() {
    return (
      <>
        <nav className='invoices-nav'>
            <h1 id='nav-header'>Create Invoice</h1>
        </nav>

        <div className='main-information-fill'>
          <label style={{'margin-left':'15px'}}>Invoice Number</label><input style={{'margin-left':'20px'}} type='text' placeholder='Invoice Number' value={this.state.invoiceNumber} onChange={e => {this.setState({invoiceNumber:e.target.value})}}/>
          <label style={{'margin-left':'20px'}}>Customer</label><input style={{'margin-left':'20px'}} type='text' placeholder='Customer Name' value={this.state.customer} onChange={e => {this.setState({customer:e.target.value})}}/>
          <label style={{'margin-left':'20px'}}>Total Due</label><input style={{'margin-left':'20px'}} type='text' placeholder='Total' value={this.state.total} onChange={e => {this.setState({total:e.target.value})}}/><br></br>
          <label style={{'margin-left':'15px'}}>Created</label><input style={{'margin-left':'87px'}} type='text' placeholder='Created Date' value={this.state.createdDate} disabled onChange={e => {this.setState({createdDate:e.target.value})}}/>
          <label style={{'margin-left':'20px'}}>Due Date</label><input style={{'margin-left':'23px'}} type='text' placeholder='dd/mm/yyyy' value={this.state.dueDate} onChange={e => {this.setState({dueDate:e.target.value})}}/>
          <label style={{'margin-left':'20px'}}>Status</label>
          <select style={{'margin-left':'50px'}} value={this.state.status} onChange={e => {this.setState({status: e.target.value})}}>
            <option value={0}>Pending</option>
            <option value={1}>Paid</option>
          </select>
        </div>

        <div className='adding-part-data'>
          <div className = 'adding-part-data-headers'>
            <table>
              <th className='invoice-convert-itemCode'>Item Code</th>
              <th className='invoice-convert-description'>Description</th>
              <th className='invoice-convert-quantity'>Quantity</th>
              <th className='invoice-convert-unitPrice'>Unit Price</th>
              <th className='invoice-convert-totalPrice'>Total Price</th>
              <th className='invoice-create-delete' style={{'text-align':'center'}}>Delete</th>
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
                })
              }
            </table>
          </div>

          <div id='save-add-delete'>
            <button onClick={this.addPart}>Add Part</button>
            <button onClick={this.createInvoice}>Create Invoice</button>
            <button onClick={this.deleteSelected}>Delete Selected</button>
          </div>
        </div>

      </>
    )
  }
}


export default CreateInvoice
