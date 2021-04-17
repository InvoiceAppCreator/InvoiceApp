import React, {Component} from 'react'
import '../components/Quotes/ConvertToInvoice.css'
import CreateConvertTable from '../components/Quotes/CreateConvertTable'
import axios from 'axios'
import SearchTable from '../components/Quotes/SearchTable'

class ConvertToInvoice extends Component {

  constructor(props) {
    super(props)
    this.state = {

      searchData : [],

      quoteNumber: '',
      invoiceNumber: `I-${Math.floor((Math.random() * 20000000) + 1)}`,
      customer: '',
      createdDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      expectedDate: '',
      total: 0.00,
      status: 'Pending',

      itemCode : [],
      description: [],
      quantity: [],
      unitPrice: [],
      totalPrice: [],
      delete: [],

      partID: 0,
      partData: [],

      data: [],
      filterArray: false,
      uniqueData: [],
      filteredData: [],

      display1: 'none',

      username: document.cookie.split('&')[0].split('=')[1],
      token: document.cookie.split('&')[1].split('=')[1]
    }
  }

  addPart = () => {
    this.state.partData.push(<CreateConvertTable partKey={this.state.partID}/>)
    this.setState({
      partID : this.state.partID + 1
    })
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/part-search/${this.state.username}/${this.state.token}`).then(res => {
      this.setState({
        searchData : res.data
      })
    })
    axios.get(`http://localhost:8000/api/quoteList/${this.state.username}/${this.state.token}`)
    .then(res => {
      this.setState({data:res.data})
      console.log(this.state.data)
    })
    document.addEventListener("click", this.hideSearch)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideSearch)
  }

  gettingQuoteNumberData = (quoteNumber) => {
    this.state.searchData.filter((x) => {
      this.setState({
        partData: [],
        total: 0,
        customer: '',
        status: 'Pending',
      })
      if (x.quoteNumber.includes(quoteNumber)) {
        if (quoteNumber === x.quoteNumber) {
          axios.get(`http://localhost:8000/api/parts/${this.state.username}/${this.state.token}`).then(res => {
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
                })
              }
            }
          })
        }
      }
      return 0
    })
  }

  changeQuoteNumber = (event) =>
  {
    this.setState({
      quoteNumber: event.target.value
    }, () => {
      this.gettingQuoteNumberData(this.state.quoteNumber)
      if (event.target.value !== '') {
        this.setState({filterArray:true})
          this.state.data.filter(x => {
            if (x.quoteNumber.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.createdDate.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.expectedDate.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.customer.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.salesperson.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.company.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.total.toLowerCase().includes(event.target.value.toLowerCase()) ||
            x.status.toLowerCase().includes(event.target.value.toLowerCase())) {
              this.state.uniqueData.push(x)
            }
            return 0
          })

      } else if (event.target.value === '') {
        this.setState  ({filterArray:false})
      }
      this.setState({
        filteredData: this.state.uniqueData,
      })
      this.setState({
        filteredData: [...new Set(this.state.filteredData)],
        uniqueData: []
      })
    })
  }

  convertToInvoice = (event) => {

    for (var i = 0; i < this.state.partID; i++) {
      var invoicePartData = {
        'partInvoiceNumber': this.state.invoiceNumber,
        'itemCode': this.state.itemCode[i],
        'author': document.cookie.split('&')[0].split('=')[1],
        'description': this.state.description[i],
        'quantity': this.state.quantity[i],
        'unitPrice': this.state.unitPrice[i],
        'totalPrice': this.state.totalPrice[i],
      }
      axios.post(`http://localhost:8000/api/part-invoice/${this.state.username}/${this.state.token}`, invoicePartData).then(res => {
        console.log(res)
      })
    }
    var invoiceData = {
      'author': document.cookie.split('&')[0].split('=')[1],
      'invoiceNumber': this.state.invoiceNumber,
      'customer': this.state.customer,
      'createdDate': this.state.createdDate,
      'dueDate': this.state.expectedDate,
      'totalDue': this.state.total,
      'status': this.state.status,
    }

    axios.post(`http://localhost:8000/api/invoiceList/${this.state.username}/${this.state.token}`, invoiceData).then(res => {
      console.log(res)
      window.location.href = 'http://localhost:3000/quotes/'
    })
  }

  showSearchBar = (event) => {
    this.setState({
      display1: 'block'
    })
  }

  getQuoteNumber = (quoteNumber) => {
    this.setState({
      display1: 'none',
      quoteNumber: quoteNumber
    }, this.gettingQuoteNumberData(quoteNumber))
  }

  hideSearch = (event) => {
    if (document.activeElement.id !== 'quoteNumber-input') {
      this.setState({
        display1: 'none'
      })
    }
  }

  render() {
    return (
      <>

        <nav className='quotes-nav'>
            <h1 id='nav-header'>Convert to Invoice</h1>
            <div style={{'margin-left':'55%'}}  id='nav-nav'>
              <p><a href='/quotes'>Quotes&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/invoices'>Invoices&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/home'>Home&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/settings'>Settings&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/logout'>Logout&nbsp;</a></p>
            </div>
        </nav>

        <div className='main-information-fill'>
          <div className='data-box' style={{display:this.state.display1}}>
            <table>
            {
              this.state.filterArray ? this.state.filteredData.map(info => <SearchTable
                                                                quoteNumber={info.quoteNumber}
                                                                customer={info.customer}
                                                                getQuote={this.getQuoteNumber}/>) : this.state.data.map(info => <SearchTable
                                                                                                          quoteNumber={info.quoteNumber}
                                                                                                          customer={info.customer}
                                                                                                          getQuote={this.getQuoteNumber}/>)
            }
            </table>
          </div>
          <label>Quote Number<input style={{'margin-left':'14px'}} id='quoteNumber-input' onClick={this.showSearchBar} type='text' placeholder="Quote Number to Convert" value={this.state.quoteNumber} onChange={this.changeQuoteNumber}/></label>
          <label style={{'margin-left':'20px'}}>Invoice Number<input style={{'margin-left':'16px'}} type='text' placeholder="Invoice Number" disabled value={this.state.invoiceNumber} onChange={e => this.setState({invoiceNumber: e.target.value})}/></label>
          <label style={{'margin-left':'20px'}}>Customer<input style={{'margin-left':'16px'}} type='text' placeholder="Customer" value={this.state.customer} onChange={e => this.setState({customer: e.target.value})}/></label><br></br>
          <label>Created<input style={{'margin-left':'70px'}} type='text' placeholder="Date Created" value={this.state.createdDate} disabled/></label>
          <label style={{'margin-left':'20px'}}>Expected<input style={{'margin-left':'73px'}} type='text' placeholder='dd/mm/yyyy' value={this.state.expectedDate} onChange={e => this.setState({expectedDate: e.target.value})}/></label>
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
