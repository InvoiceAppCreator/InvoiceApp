import React, {Component} from 'react'
import '../components/Quotes/createQuote.css'
import CreateQuoteTable from '../components/Quotes/createQuoteTable'
import axios from 'axios'

class CreateQuote extends Component {

  constructor(props) {
    super(props)
    this.state = {
      quoteNumber: `Q-${Math.floor((Math.random() * 20000000) + 1)}`,
      customers: '',
      total: 0.00,
      createdDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      salesperson: `${document.cookie.split('&')[2].split('=')[1]} ${document.cookie.split('&')[3].split('=')[1]}`,
      expectedDate: '',
      company: '',
      status: 'Order',

      modelNumber: [],
      partNumber: [],
      description: [],
      cost: [],
      price: [],
      qtyOnHand: [],
      qtyComitted: [],
      delete: [],

      totalArray: [0],

      partID : 1,
      partData : [<CreateQuoteTable partKey={0}/>],

      savedData: [],

      username: document.cookie.split('&')[0].split('=')[1],
      token: document.cookie.split('&')[1].split('=')[1],

      serverDomain: 'http://localhost:8000',
      clientDomain: 'http://localhost:3000',

      headers : {headers: {Authorization:document.cookie.split('&')[1].split('=')[1]}}
    }
  }

  componentDidMount() {
    document.title = 'Create Quote'
    document.addEventListener('keyup', this.getTotal)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.getTotal)
  }

  getTotal = (event) => {
    this.state.totalArray = [0]
    for (var i = 0; i < this.state.partID; i++) {
      var price = document.getElementById(`price${i}`)
      var qtyComitted = document.getElementById(`qtyComitted${i}`)

      if (price !== null && qtyComitted !== null && price.innerHTML !== '' && qtyComitted.innerHTML !== '' && !isNaN(price.innerHTML) && !isNaN(qtyComitted.innerHTML)) {
        let totalValuePerRow = price.innerHTML * qtyComitted.innerHTML
        this.state.totalArray.push(totalValuePerRow)
      }
    }
    let allRowsTotal = this.state.totalArray.reduce((total, num) => {
      return total + num
    })
    this.setState({
      total:allRowsTotal
    })
  }

  addPart = () => {
    this.state.partData.push(<CreateQuoteTable partKey={this.state.partID}/>)
    this.setState({
      partID : this.state.partID + 1
    })
  }

  saveQuote = () => {
    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`modelNumber${i}`) !== null &&
      document.getElementById(`partNumber${i}`) !== null &&
      document.getElementById(`description${i}`) !== null &&
      document.getElementById(`cost${i}`) !== null &&
      document.getElementById(`price${i}`) !== null &&
      document.getElementById(`qtyOnHand${i}`) !== null &&
      document.getElementById(`qtyComitted${i}`) !== null) {
        this.state.modelNumber.push(document.getElementById(`modelNumber${i}`).innerHTML)
        this.state.partNumber.push(document.getElementById(`partNumber${i}`).innerHTML)
        this.state.description.push(document.getElementById(`description${i}`).innerHTML)
        this.state.cost.push(document.getElementById(`cost${i}`).innerHTML)
        this.state.price.push(document.getElementById(`price${i}`).innerHTML)
        this.state.qtyOnHand.push(document.getElementById(`qtyOnHand${i}`).innerHTML)
        this.state.qtyComitted.push(document.getElementById(`qtyComitted${i}`).innerHTML)

        var info = {
          'partQuoteNumber' : this.state.quoteNumber,
          'author': document.cookie.split('&')[0].split('=')[1],
          'partModelNumber' : this.state.modelNumber[i],
          'partNumber' : this.state.partNumber[i],
          'partDescription' : this.state.description[i],
          'partCost' : this.state.cost[i],
          'partPrice' : this.state.price[i],
          'partQtyOnHand' : this.state.qtyOnHand[i],
          'partQtyCommitted' : this.state.qtyComitted[i]
        }

        axios.post(`${this.state.serverDomain}/api/parts/${this.state.username}`, info, this.state.headers).then(res => {
          console.log(res)
        })
      }
    }
    var quoteData = {
      'author': document.cookie.split('&')[0].split('=')[1],
      'quoteNumber': this.state.quoteNumber,
      'customers': this.state.customers,
      'total': parseFloat(this.state.total).toFixed(2),
      'createdDate': this.state.createdDate,
      'salesperson': this.state.salesperson,
      'expectedDate': this.state.expectedDate,
      'company': this.state.company,
      'status': this.state.status
    }
    axios.post(`${this.state.serverDomain}/api/quoteList/${this.state.username}`, quoteData, this.state.headers).then(res => {
      console.log(res)
      window.location.href = `${this.state.clientDomain}/quotes/`
    })
  }


  deleteSelected =() => {
    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`delete${i}`) !== null) {
        if (document.getElementById(`delete${i}`).checked) {
          document.getElementById(`delete${i}`).checked = false;
          var arr = this.state.partData
          arr[i] = ''
          var totalValueForDelete = parseFloat(document.getElementById(`price${i}`).innerHTML).toFixed(2) * parseFloat(document.getElementById(`qtyComitted${i}`).innerHTML).toFixed(2)
          this.setState({
            total: parseFloat(this.state.total).toFixed(2) - parseFloat(totalValueForDelete).toFixed(2)
          })
          this.setState({partData: arr})
          console.log("Deleting..." + i)
        } else {
          continue
        }
      }
    }
  }

  render() {
    return (
      <>
      <nav className='quotes-nav'>
          <h1 id='nav-header'>Create Quote</h1>
          <div style={{'margin-left':'55%'}}  id='nav-nav'>
            <p><a href='/quotes'>Quotes&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/invoices'>Invoices&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/home'>Home&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/settings'>Settings&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/logout'>Logout&nbsp;</a></p>
          </div>
      </nav>

      <div className='main-information-fill'>
        <label>Quote Number</label><input style={{'margin-left':'20px'}} type='text' disabled value={this.state.quoteNumber} placeholder='Quote Number' onChange={e => {this.setState({quoteNumber:e.target.value})}}/>
        <label style={{'margin-left':'34px'}}>Customers</label><input style={{'margin-left':'34px'}} type='text' value={this.state.customers} placeholder='Customers' onChange={e => {this.setState({customers:e.target.value})}}/>
        <label style={{'margin-left':'34px'}}>Total</label><input type='text' style={{'margin-left':'34px'}} value={this.state.total.toFixed(2)} disabled placeholder='Total Value'/><br></br>
        <label>Created Date</label><input type='text' style={{'margin-left':'34px'}} value={this.state.createdDate} placeholder='Today' onChange={e => {this.setState({createdDate:e.target.value})}} disabled/>
        <label style={{'margin-left':'34px'}}>Salesperson</label><input type='text' style={{'margin-left':'24px'}} value={this.state.salesperson} placeholder='Salesperson Name' onChange={e => {this.setState({salesperson:e.target.value})}}/>
        <label style={{'margin-left':'34px'}}>Status</label>
          <select style={{'margin-left':'25px'}} value={this.state.status} onChange={e => {this.setState({status: e.target.value})}}>
            <option value={'Order'}>Order</option>
            <option value={'Done'}>Done</option>
          </select><br></br>
        <label>Expected Date</label><input type='text' style={{'margin-left':'20px'}} value={this.state.expectedDate} placeholder='dd/mm/yyyy' onChange={e => {this.setState({expectedDate:e.target.value})}}/>
        <label style={{'margin-left':'34px'}}>Company</label><input type='text' style={{'margin-left':'44px'}} value={this.state.company} placeholder='Company' onChange={e => {this.setState({company:e.target.value})}}/>

      </div>

      <div className='adding-part-data'>
        <div className = 'adding-part-data-headers'>
          <table>
            <thead>
              <th className='modelNumber'>Model Number</th>
              <th className='partNumber'>Part Number</th>
              <th className='description'>Description</th>
              <th className='cost'>Cost</th>
              <th className='price'>Price</th>
              <th className='qtyOnHand'>On Hand</th>
              <th className='qtyComitted'>Comitted</th>
              <th className='delete' style={{'text-align':'center'}}>Delete</th>
            </thead>
          </table>
        </div>

        <div className = 'adding-part-data-table'>
          <table contenteditable id='adding-part-data-table-actualTable'>
            <tbody>
              {
                this.state.partData.map(x => {
                  try {
                    return x
                  } catch (e){

                  }
                  return 0
                })
              }
            </tbody>
          </table>
        </div>

        <div id='save-add-delete'>
          <button onClick={this.addPart}>Add Part</button>
          <button onClick={this.saveQuote}>Save Quote</button>
          <button onClick={this.deleteSelected}>Delete Selected</button>
        </div>

      </div>
      </>
    )
  }
}

export default CreateQuote
