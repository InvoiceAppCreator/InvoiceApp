import React, { Component } from 'react'
import './Invoices.css'
import axios from 'axios'
import TableTemplate from './TableTemplate'
import loader from '../Quotes/Images/loading2.gif'
import EditTable from './EditTable'

class InvoiceTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profilePicture: '',
      backgroundPicture: '',
      data: [],
      opacity: '1',
      display: 'none',
      invoiceID: 0,
      invoiceNumberOriginal: '',
      filterArray: false,
      uniqueData: [],
      filteredData: [],

      display2: 'none',
      display3: 'none',
      display4: 'none',
      display5: 'none',
      display5_1: true,
      display5_2: '1',

      databaseSearch: '',

      invoiceNumber: '',
      customer: '',
      createdDate: '',
      dueDate: '',
      totalDue: 0.00,
      status: '',

      databaseID: [],
      itemCode: [],
      description: [],
      quantity: [],
      unitPrice: [],
      totalPrice: [],
      delete: [],

      itemCodeSave: [],
      descriptionSave: [],
      quantitySave: [],
      unitPriceSave: [],
      totalPriceSave: [],
      deleteSave: [],

      totalArray: [0],

      partID: 0,
      partData: [],

      file: null,

      username: document.cookie.split('&')[0].split('=')[1],
      token: document.cookie.split('&')[1].split('=')[1],

      serverDomain: 'http://localhost:8000',
      clientDomain: 'http://localhost:3000',

      headers : {headers: {Authorization:document.cookie.split('&')[1].split('=')[1]}}

    }
  }

  componentDidMount() {
    document.title = 'Invoices'
    document.addEventListener('keyup', this.getTotal)
    axios.get(`${this.state.serverDomain}/api/invoiceList/${this.state.username}`, this.state.headers)
    .then(res => {
      this.setState({data:res.data})
    })
    axios({
      method: 'GET',
      url: `${this.state.serverDomain}/api/userImages/${this.state.username}`,
      headers: {
        Authorization: this.state.token
      }
    }).then(res => {
      this.setState({
        profilePicture:`${this.state.serverDomain}${res.data[0].profilePicture}`,
        backgroundPicture:`${this.state.serverDomain}${res.data[0].backgroundPicture}`,
      })
    })
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.getTotal)
  }

  getTotal = (event) => {
    this.state.totalArray = [0]
    for (var i = 0; i < this.state.partID; i++) {
      var price = document.getElementById(`invoice-tableParts-1-unitPrice${i}`)
      var qtyComitted = document.getElementById(`invoice-tableParts-1-quantity${i}`)

      if (price !== null && qtyComitted !== null && price.innerHTML !== '' && qtyComitted.innerHTML !== '' && !isNaN(price.innerHTML) && !isNaN(qtyComitted.innerHTML)) {
        let totalValuePerRow = price.innerHTML * qtyComitted.innerHTML
        this.state.totalArray.push(totalValuePerRow)
        document.getElementById(`invoice-tableParts-1-totalPrice${i}`).innerHTML = parseFloat(totalValuePerRow).toFixed(2)
      }
    }
    let allRowsTotal = this.state.totalArray.reduce((total, num) => {
      return total + num
    })
    this.setState({
      totalDue: parseFloat(allRowsTotal).toFixed(2)
    })
  }

  createInvoice = (event) => {
    window.location.href = `${this.state.clientDomain}/invoices/create-invoice`
  }

  sendIDtoEditPage = (id) => {
    this.setState({
      display: 'block',
      opacity: '0.3'
    })

    axios.get(`${this.state.serverDomain}/api/invoiceList/${this.state.username}`, this.state.headers).then(res => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].id === id) {
          this.setState({
            invoiceNumber: res.data[i].invoiceNumber,
            customer: res.data[i].customer,
            createdDate: res.data.[i].createdDate,
            dueDate: res.data.[i].dueDate,
            totalDue: parseFloat(res.data[i].totalDue).toFixed(2),
            status: res.data[i].status,
          })
        }
      }
      axios.get(`${this.state.serverDomain}/api/part-invoice/${this.state.username}`, this.state.headers).then(res => {
        res.data.filter((x) => {
          if (x.partInvoiceNumber === this.state.invoiceNumber) {
            this.state.databaseID.push(x.id)
            this.state.itemCode.push(x.itemCode)
            this.state.description.push(x.description)
            this.state.quantity.push(x.quantity)
            this.state.unitPrice.push(x.unitPrice)
            this.state.totalPrice.push(parseFloat(x.totalPrice).toFixed(2))

            this.state.partData.push(<EditTable partKey={this.state.partID}
                                      itemCode={this.state.itemCode[this.state.partID]}
                                      description={this.state.description[this.state.partID]}
                                      quantity={this.state.quantity[this.state.partID]}
                                      unitPrice={this.state.unitPrice[this.state.partID]}
                                      totalPrice={parseFloat(this.state.totalPrice[this.state.partID]).toFixed(2)}/>)

            this.setState({
              partID: this.state.partID + 1
            })
          }
          return 0
        })
      })
    })
    this.setState({
      invoiceNumberOriginal: id
    })
  }

  cancelEdit = (event) => {
    this.setState({
      opacity: '1',
      display: 'none',
      display2: 'none',
      display3: 'none',

      databaseID: [],
      itemCode: [],
      description: [],
      quantity: [],
      unitPrice: [],
      totalPrice: [],
      delete: [],

      itemCodeSave: [],
      descriptionSave: [],
      quantitySave: [],
      unitPriceSave: [],
      totalPriceSave: [],
      deleteSave: [],

      partID: 0,
      partData: [],
    })
  }

  addPart = () => {
    this.state.partData.push(<EditTable partKey={this.state.partID}/>)
    this.setState({
      partID : this.state.partID + 1
    })
  }

  deleteSelected = () => {
    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`invoice-tableParts-1-delete${i}`) !== null) {
        if (document.getElementById(`invoice-tableParts-1-delete${i}`).checked) {
          document.getElementById(`invoice-tableParts-1-delete${i}`).checked = false;
          var arr = this.state.partData
          arr[i] = ''
          var totalValueForDelete = parseFloat(document.getElementById(`invoice-tableParts-1-unitPrice${i}`).innerHTML).toFixed(2) * parseFloat(document.getElementById(`invoice-tableParts-1-quantity${i}`).innerHTML).toFixed(2)
          this.setState({
            totalDue: parseFloat(this.state.totalDue).toFixed(2) - parseFloat(totalValueForDelete).toFixed(2)
          })
          if (document.getElementById(`invoice-tableParts-1-itemCode${i}`) !== null && document.getElementById(`invoice-tableParts-1-itemCode${i}`).innerHTML !== '') {
            this.state.deleteSave.push(document.getElementById(`invoice-tableParts-1-itemCode${i}`).innerHTML)
          }
          this.setState({partData: arr})
        } else {
          continue
        }
      }
    }
  }

  saveInvoice = (event) => {
    axios({
      method: 'DELETE',
      url: `${this.state.serverDomain}/api/part-invoice/${this.state.username}`,
      data: [this.state.deleteSave, 'notDelete'],
      headers: {
        Authorization: this.state.token
      }
    })

    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`invoice-tableParts-1-itemCode${i}`) !== null &&
        document.getElementById(`invoice-tableParts-1-descriptionr${i}`) !== null &&
        document.getElementById(`invoice-tableParts-1-quantity${i}`) !== null &&
        document.getElementById(`invoice-tableParts-1-unitPrice${i}`) !== null &&
        document.getElementById(`invoice-tableParts-1-totalPrice${i}`) !== null) {
          this.state.itemCodeSave.push(document.getElementById(`invoice-tableParts-1-itemCode${i}`).innerHTML)
          this.state.descriptionSave.push(document.getElementById(`invoice-tableParts-1-descriptionr${i}`).innerHTML)
          this.state.quantitySave.push(document.getElementById(`invoice-tableParts-1-quantity${i}`).innerHTML)
          this.state.unitPriceSave.push(document.getElementById(`invoice-tableParts-1-unitPrice${i}`).innerHTML)
          this.state.totalPriceSave.push(parseFloat(document.getElementById(`invoice-tableParts-1-totalPrice${i}`).innerHTML)).toFixed(2)

          var infoToBeUpdated = {
            'invoiceNumberOriginal':this.state.databaseID[i],
            'partInvoiceNumber':this.state.invoiceNumber,
            'author':document.cookie.split('&')[0].split('=')[1],
            'itemCode':this.state.itemCodeSave[i],
            'description':this.state.descriptionSave[i],
            'quantity':this.state.quantitySave[i],
            'unitPrice':this.state.unitPriceSave[i],
            'totalPrice':parseFloat(this.state.totalPriceSave[i]).toFixed(2),
          }

          axios.put(`${this.state.serverDomain}/api/part-invoice/${this.state.username}`, infoToBeUpdated, this.state.headers)
      }
    }

    var updatedHeaderInfo = {
      'author':document.cookie.split('&')[0].split('=')[1],
      'invoiceNumberOriginal':this.state.invoiceNumberOriginal,
      'customer':this.state.customer,
      'invoiceNumber':this.state.invoiceNumber,
      'createdDate':this.state.createdDate,
      'dueDate':this.state.dueDate,
      'totalDue':parseFloat(this.state.totalDue).toFixed(2),
      'status':this.state.status
    }

    axios.put(`${this.state.serverDomain}/api/invoiceList/${this.state.username}`,  updatedHeaderInfo, this.state.headers).then(res => {
      window.location.href = `${this.state.clientDomain}/invoices`
    })

  }

  deleteInvoice = (event) => {
    axios({
      method: 'DELETE',
      url: `${this.state.serverDomain}/api/invoiceList/${this.state.username}`,
      data: [this.state.invoiceNumber],
      headers: {
        Authorization: this.state.token
      }
    }).then(res => {
      axios({
        method: 'DELETE',
        url: `${this.state.serverDomain}/api/part-invoice/${this.state.username}`,
        data: [this.state.databaseID, 'allDelete'],
        headers: {
          Authorization: this.state.token
        }
      }).then(res => {
        window.location.href = `${this.state.clientDomain}/invoices`
      })
    })
  }

  importScreen = (event) => {
    this.setState({
      display2: 'block',
      opacity: '0.3',
    })
  }

  submitFile = (event) => {
    const formData = new FormData()
    formData.append('files', this.state.file)
    axios.post(`${this.state.serverDomain}/api/uploadFileInvoice/${this.state.username}`, formData, this.state.headers).then(res => {
      console.log(res)
      this.setState({
        display2: 'none',
        opacity: '1',
      })
      window.location.href = `${this.state.clientDomain}/invoices`
    })

  }



  handleUpload = (event) => {
    this.setState({
      file: event.target.files[0]
    })
  }

  exportToPDF = (event) => {
    var infoToBePDFed = {
      'invoiceNumber': this.state.invoiceNumber,
      'customer': this.state.customer,
      'createdDate': this.state.createdDate,
      'dueDate': this.state.dueDate,
      'totalDue': parseFloat(this.state.totalDue).toFixed(2),

      'itemCode': this.state.itemCode,
      'description': this.state.description,
      'quantity': this.state.quantity,
      'unitPrice': this.state.unitPrice,
      'totalPrice': parseFloat(this.state.totalPrice).toFixed(2),
    }
    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.state.token,
      },
      body: JSON.stringify(infoToBePDFed)
    }
    fetch(`${this.state.serverDomain}/api/invoicePDF/${this.state.username}`, options).then(
      response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = url
          a.download = this.state.invoiceNumber
          a.click()
        })
      }
    )
  }

  emailInvoice = (event) => {
    this.setState({
      display: 'none',
      display2: 'none',
      display3: 'block',
    })
  }

  sendEmail = (event) => {
    const formData = new FormData()
    formData.append('filePDF', this.state.pdfFile)
    formData.append('recipients', this.state.recipients)
    formData.append('message', this.state.message)
    formData.append('subject', this.state.subject)
    formData.append('nowOrLater', this.state.nowOrLater)
    formData.append('timeToSend', this.state.timeToSend)

    this.setState({
      display3: 'none',
      display4: 'block'
    })

    axios.post(`${this.state.serverDomain}/api/email/${this.state.username}`, formData, this.state.headers).then(res => {
      window.location.href = `${this.state.clientDomain}/invoices`
    })
  }

  showSearch = (event) => {
    this.setState({
      display5_2: '0.3',
      display5: 'block',
    })

    if (this.state.display5_1 === true) {
      this.setState({
        display5_1: false,
        display5_2: '0.3',
        display5: 'block',
      })
    } else if (this.state.display5_1 === false) {
      this.setState({
        display5_1: true,
        display5_2: '1',
        display5: 'none',
      })
    }
  }

  search = (event) => {this.setState({databaseSearch: event.target.value}, () => {
      if (event.target.value !== '') {
        this.setState({filterArray:true})
        this.state.data.filter(x => {
          if (x.invoiceNumber.toLowerCase().includes(event.target.value.toLowerCase()) ||
          x.customer.toLowerCase().includes(event.target.value.toLowerCase()) ||
          x.createdDate.toLowerCase().includes(event.target.value.toLowerCase()) ||
          x.dueDate.toLowerCase().includes(event.target.value.toLowerCase()) ||
          x.totalDue.toLowerCase().includes(event.target.value.toLowerCase()) ||
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
        uniqueData: []
      })
    })
  }

  render() {
    return (
      <>
        <div className='invoices-user' style={{'opacity':this.state.opacity}} style={{'opacity':this.state.display5_2}}>
          <img src={this.state.profilePicture} alt=''/>
          <hr id='user-line'></hr>
          <p>{`${document.cookie.split('&')[2].split('=')[1]} ${document.cookie.split('&')[3].split('=')[1]}`}</p>
          <p>{`${document.cookie.split('&')[4].split('=')[1]}`}</p>
        </div>
        <div className='invoices-buttons' style={{'opacity':this.state.opacity}} style={{'opacity':this.state.display5_2}}>
          <div id='buttons-background-image'>
            <img src={this.state.backgroundPicture} alt=''/>
          </div>
          <div id='buttons-function-buttons' style={{'opacity':this.state.opacity}}>
            <button id='button-functions-buttons-create' onClick={this.createInvoice}>Create</button>
            <button id='button-functions-buttons-import' onClick={this.importScreen}>Import</button>
          </div>
        </div>

        <div className='invoices-invoicesTable' style={{'opacity':this.state.opacity}}>
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
                this.state.filterArray ? this.state.filteredData.map(info => <TableTemplate invoiceNumber={info.invoiceNumber}
                                                          customer={info.customer}
                                                          createdDate={info.createdDate}
                                                          dueDate={info.dueDate}
                                                          totalDue={parseFloat(info.totalDue).toFixed(2)}
                                                          status={info.status}
                                                          myFunction={this.sendIDtoEditPage}
                                                          id={info.id}/>) : this.state.data.map(info => <TableTemplate invoiceNumber={info.invoiceNumber}
                                                                                                    customer={info.customer}
                                                                                                    createdDate={info.createdDate}
                                                                                                    dueDate={info.dueDate}
                                                                                                    totalDue={parseFloat(info.totalDue).toFixed(2)}
                                                                                                    status={info.status}
                                                                                                    myFunction={this.sendIDtoEditPage}
                                                                                                    id={info.id}/>)
              }
              </table>
            </div>
          </div>
          <div id='invoicesTable-buttons' style={{'opacity':this.state.opacity}}>
            <button id='invoicesTable-buttons-search' onClick={this.showSearch}>{this.state.display5_1 ? "Search" : "Cancel"}</button>
          </div>
        </div>

        <div id='search-field' style={{display:this.state.display5}}>
          <input id='database_search' autofocus type='text' value={this.state.databaseSearch} onChange={this.search} placeholder='Database Search'/>
        </div>

        <div id='importing-page' style={{display:this.state.display2}}>
          <label>Import Excel File</label><br></br>
          <input type='file' accept='.xlsx' onChange={this.handleUpload}/><br></br>
          <button onClick={this.submitFile}>Import File</button>
          <button onClick={this.cancelEdit}>Cancel</button>
        </div>

        <div id='email-page' style={{display:this.state.display3}}>
          <label>To: </label><input id='recipients' placeholder='Recipients' value={this.state.recipients} onChange={e => this.setState({recipients:e.target.value})} type='text'/><br></br>
          <label>Subject</label><br></br>
          <input id='recipients' type='text' placeholder='Subject' value={this.state.subject} onChange={e => this.setState({subject:e.target.value})}/>
          <hr></hr>
          <label>Message</label><br></br>
          <textarea placeholder='Type Message...' value={this.state.message} onChange={e => this.setState({message: e.target.value})}></textarea>
          <hr></hr>
          <label>PDF</label><input accept='.pdf' type='file' onChange={e => this.setState({pdfFile:e.target.files[0]})}/><br></br>
          <hr></hr>
          <label>Send</label><br></br>
          <input type='radio' id='now' value='now' name='timeToSend' onChange={e => this.setState({nowOrLater:e.target.value})}/>Now<br></br>
          <input type='radio' id='later' value='later' name='timeToSend' onChange={e => this.setState({nowOrLater:e.target.value})}/>Later
          <input type='text' placeholder='DD/MM/YYYY HH:MM AM/PM' id='time' value={this.state.timeToSend} onChange={e => this.setState({timeToSend:e.target.value})}/><br></br>
          <hr></hr>
          <button onClick={this.sendEmail}>Send</button>
          <button onClick={this.cancelEdit}>Cancel</button>
        </div>

        <div className='gif-loader' style={{display:this.state.display4}}>
          <img src={loader} alt=''/>
        </div>

        <div className='edit-delete-add-invoice' style={{'display':this.state.display}}>
          <div id='quote-information'>
            <label style={{'margin-left':'15px'}}>Invoice Number</label><input value={this.state.invoiceNumber} onChange={e => {this.setState({invoiceNumber:e.target.value})}} placeholder='Quote Number' type='text' style={{'margin-left':'18px'}}/>
            <label style={{'margin-left':'20px'}}>Customer</label><input type='text' value={this.state.customer} onChange={e => {this.setState({customer:e.target.value})}} placeholder='Customer' style={{'margin-left':'19px'}}/>
            <label style={{'margin-left':'20px'}}>Total</label><input type='text' value={parseFloat(this.state.totalDue).toFixed(2)} onChange={e => {this.setState({totalDue:e.target.value})}} placeholder='Total' style={{'margin-left':'20px'}}/><br></br>
            <label style={{'margin-left':'15px'}}>Created Date</label><input type='text' disabled value={this.state.createdDate} placeholder='dd/mm//yyyy'  style={{'margin-left':'44px'}}/>
            <label style={{'margin-left':'20px'}}>Due Date</label><input value={this.state.dueDate} onChange={e => {this.setState({dueDate:e.target.value})}} placeholder='dd/mm//yyyy' type='text' style={{'margin-left':'20px'}}/>
            <label style={{'margin-left':'20px'}}>Status</label>
              <select style={{'margin-left':'14px'}} value={this.state.status} onChange={e => {this.setState({status:e.target.value})}}>
                <option value={'Pending'}>Pending</option>
                <option value={'Paid'}>Paid</option>
              </select><br></br>

          </div>

          <div id='quote-tableParts'>
            <div id='quote-tableParts-1'>
              <table>
                <tr>
                  <th className='invoice-tableParts-1-itemCode'>Item Code</th>
                  <th className='invoice-tableParts-1-description'>Description</th>
                  <th className='invoice-tableParts-1-quantity'>Quantity</th>
                  <th className='invoice-tableParts-1-unitPrice'>Unit Price</th>
                  <th className='invoice-tableParts-1-totalPrice'>Total Price</th>
                  <th className='invoice-tableParts-1-delete'>Delete</th>
                </tr>
              </table>
            </div>

            <div id='quote-tableParts-2'>
              <table>
                {
                  this.state.partData.map(x => {
                    return x
                  })
                }
              </table>
            </div>
          </div>
          <div id='quote-buttons-for-edit-delete-add'>
            <button onClick={this.saveInvoice}>Save Invoice</button>
            <button style={{'border-right':'2px solid black'}} onClick={this.cancelEdit}>Cancel</button>
            <button style={{'border-right':'2px solid black'}} onClick={this.addPart}>Add Part</button>
            <button onClick={this.deleteSelected}>Delete Selected</button>
            <button onClick={this.deleteInvoice}>Delete Invoice</button>
          </div>

          <div id='pdf-email'>
            <button style={{'border-right':'2px solid black'}} onClick={this.exportToPDF}>Export To PDF</button>
            <button onClick={this.emailInvoice}>Email Invoice</button>
          </div>
        </div>

      </>
    )
  }
}

export default InvoiceTable
