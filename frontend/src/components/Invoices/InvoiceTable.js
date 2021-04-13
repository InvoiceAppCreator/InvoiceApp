import React, { Component } from 'react'
import './Invoices.css'
import axios from 'axios'
import TableTemplate from './TableTemplate'
import image from '../Home/Images/SunBackground.jpg'
import image2 from '../Quotes/Images/sampleFace4.png'
import loader from '../Quotes/Images/loading2.gif'
import EditTable from './EditTable'

class InvoiceTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      opacity: '1',
      display: 'none',
      invoiceID: 0,
      invoiceNumberOriginal: '',

      display2: 'none',
      display3: 'none',
      display4: 'none',

      invoiceNumber: '',
      customer: '',
      createdDate: '',
      dueDate: '',
      totalDue: '',
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

      partID: 0,
      partData: [],

      file: null,

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

  sendIDtoEditPage = (id) => {
    this.setState({
      display: 'block',
      opacity: '0.3'
    })

    axios.get(`http://localhost:8000/api/invoiceList/${document.cookie.split(';')[0].split('=')[1]}`).then(res => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].id === id) {
          this.setState({
            invoiceNumber: res.data[i].invoiceNumber,
            customer: res.data[i].customer,
            createdDate: res.data.[i].createdDate,
            dueDate: res.data.[i].dueDate,
            totalDue: res.data[i].totalDue,
            status: res.data[i].status,
          })
        }
      }
      axios.get(`http://localhost:8000/api/part-invoice/${document.cookie.split(';')[0].split('=')[1]}`).then(res => {
        res.data.filter((x) => {
          if (x.partInvoiceNumber === this.state.invoiceNumber) {
            this.state.databaseID.push(x.id)
            this.state.itemCode.push(x.itemCode)
            this.state.description.push(x.description)
            this.state.quantity.push(x.quantity)
            this.state.unitPrice.push(x.unitPrice)
            this.state.totalPrice.push(x.totalPrice)

            this.state.partData.push(<EditTable partKey={this.state.partID}
                                      itemCode={this.state.itemCode[this.state.partID]}
                                      description={this.state.description[this.state.partID]}
                                      quantity={this.state.quantity[this.state.partID]}
                                      unitPrice={this.state.unitPrice[this.state.partID]}
                                      totalPrice={this.state.totalPrice[this.state.partID]}/>)

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
    axios.delete(`http://localhost:8000/api/part-invoice/${document.cookie.split(';')[0].split('=')[1]}`, {'data': [this.state.deleteSave, 'notDelete']})

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
          this.state.totalPriceSave.push(document.getElementById(`invoice-tableParts-1-totalPrice${i}`).innerHTML)

          var infoToBeUpdated = {
            'invoiceNumberOriginal':this.state.databaseID[i],
            'partInvoiceNumber':this.state.invoiceNumber,
            'author':document.cookie.split(';')[0].split('=')[1],
            'itemCode':this.state.itemCodeSave[i],
            'description':this.state.descriptionSave[i],
            'quantity':this.state.quantitySave[i],
            'unitPrice':this.state.unitPriceSave[i],
            'totalPrice':this.state.totalPriceSave[i],
          }

          axios.put(`http://localhost:8000/api/part-invoice/${document.cookie.split(';')[0].split('=')[1]}`, infoToBeUpdated).then(res => {
            console.log(res)
          })
      }
    }

    var updatedHeaderInfo = {
      'author':document.cookie.split(';')[0].split('=')[1],
      'invoiceNumberOriginal':this.state.invoiceNumberOriginal,
      'customer':this.state.customer,
      'invoiceNumber':this.state.invoiceNumber,
      'createdDate':this.state.createdDate,
      'dueDate':this.state.dueDate,
      'totalDue':this.state.totalDue,
      'status':this.state.status
    }

    axios.put(`http://localhost:8000/api/invoiceList/${document.cookie.split(';')[0].split('=')[1]}`,  updatedHeaderInfo).then(res => {
      window.location.href = 'http://localhost:3000/invoices'
    })

  }

  deleteInvoice = (event) => {
    axios.delete(`http://localhost:8000/api/invoiceList/${document.cookie.split(';')[0].split('=')[1]}`, {'data':[this.state.invoiceNumber]}).then(res => {
      axios.delete(`http://localhost:8000/api/part-invoice/${document.cookie.split(';')[0].split('=')[1]}`, {'data': [this.state.databaseID, 'allDelete']}).then(res => {
        window.location.href = 'http://localhost:3000/invoices'
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
    axios.post(`http://localhost:8000/api/uploadFileInvoice/${document.cookie.split(';')[0].split('=')[1]}`, formData).then(res => {
      console.log(res)
      this.setState({
        display2: 'none',
        opacity: '1',
      })
      window.location.href = 'http://localhost:3000/invoices'
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
      'totalDue': this.state.totalDue,

      'itemCode': this.state.itemCode,
      'description': this.state.description,
      'quantity': this.state.quantity,
      'unitPrice': this.state.unitPrice,
      'totalPrice': this.state.totalPrice,
    }
    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(infoToBePDFed)
    }
    fetch(`http://localhost:8000/api/invoicePDF/${document.cookie.split(';')[0].split('=')[1]}`, options).then(
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

    axios.post(`http://localhost:8000/api/email/${document.cookie.split(';')[0].split('=')[1]}`, formData).then(res => {
      window.location.href = 'http://localhost:3000/invoices'
    })
  }





  render() {
    return (
      <>
        <div className='invoices-user' style={{'opacity':this.state.opacity}}>
          <img src={image2} alt=''/>
          <hr id='user-line'></hr>
          <p>{document.cookie.split(';')[0].split('=')[1]}</p>
          <p>{`${document.cookie.split(';')[0].split('=')[1]}@gmail.com`}</p>
        </div>
        <div className='invoices-buttons' style={{'opacity':this.state.opacity}}>
          <div id='buttons-background-image'>
            <img src={image} alt=''/>
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
                this.state.data.map(info => <TableTemplate invoiceNumber={info.invoiceNumber}
                                                          customer={info.customer}
                                                          createdDate={info.createdDate}
                                                          dueDate={info.dueDate}
                                                          totalDue={info.totalDue}
                                                          status={info.status}
                                                          myFunction={this.sendIDtoEditPage}
                                                          id={info.id}/>)

              }
              </table>
            </div>
          </div>
          <div id='invoicesTable-buttons' style={{'opacity':this.state.opacity}}>
            <button id='invoicesTable-buttons-search'>Search</button>
          </div>
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
            <label style={{'margin-left':'20px'}}>Total</label><input type='text' value={this.state.totalDue} onChange={e => {this.setState({totalDue:e.target.value})}} placeholder='Total' style={{'margin-left':'20px'}}/><br></br>
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
