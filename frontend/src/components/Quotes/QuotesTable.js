import React, {Component} from 'react'
import TableTemplate from './TableTemplate'
import './Quotes.css'
import image from '../Home/Images/SunBackground.jpg'
import image2 from './Images/sampleFace2.png'
import loader from './Images/loading2.gif'
import axios from 'axios'
import EditTable from './EditTable'

class QuotesTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      display: 'none',
      opacity: '1',
      quoteID: 0,
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

      quoteNumberOriginal: '',
      quoteNumber: '',
      customer: '',
      total: '',
      createdDate: '',
      salesperson: '',
      status: '',
      expectedDate: '',
      company: '',


      databaseID: [],
      modelNumber: [],
      partNumber: [],
      description: [],
      cost: [],
      price: [],
      onHand: [],
      comitted: [],
      delete: [],

      modelNumberSave: [],
      partNumberSave: [],
      descriptionSave: [],
      costSave: [],
      priceSave: [],
      onHandSave: [],
      comittedSave: [],
      deleteSave: [],

      partID: 0,
      partData: [],

      file: null,

      recipients: '',
      message: '',
      pdfFile: null,
      nowOrLater : '',
      timeToSend: '',
      subject: ''
    }
  }

  createQuote = (event) => {
    window.location.href = 'http://localhost:3000/quotes/create-quote'
  }

  convertToInvoice = (event) => {
    window.location.href = 'http://localhost:3000/quotes/convert-to-invoice'
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/quoteList/${document.cookie.split(';')[0].split('=')[1]}`)
    .then(res => {
      this.setState({data:res.data})
    })
  }

  // -------------------- Pop Up Page START --------------------

  sendIDtoEditPage = (id) => {
    this.setState({
      display: 'block',
      opacity: '0.3',
      quoteID: id,
    })

    axios.get(`http://localhost:8000/api/quoteList/${document.cookie.split(';')[0].split('=')[1]}`).then(res => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].id === id) {
          this.setState({
            quoteNumber: res.data[i].quoteNumber,
            customer: res.data[i].customer,
            total: res.data[i].total,
            createdDate: res.data[i].createdDate,
            salesperson: res.data[i].salesperson,
            status: res.data[i].status,
            expectedDate: res.data[i].expectedDate,
            company: res.data[i].company,
          })
        }
      }
      axios.get(`http://localhost:8000/api/parts/${document.cookie.split(';')[0].split('=')[1]}`).then(res => {
        res.data.filter((x) => {
          if (x.partQuoteNumber === this.state.quoteNumber) {
            this.state.databaseID.push(x.id)
            this.state.modelNumber.push(x.partModelNumber)
            this.state.partNumber.push(x.partNumber)
            this.state.description.push(x.partDescription)
            this.state.cost.push(x.partCost)
            this.state.price.push(x.partPrice)
            this.state.onHand.push(x.partQtyOnHand)
            this.state.comitted.push(x.partQtyCommitted)

            this.state.partData.push(<EditTable partKey={this.state.partID}
                                                modelNumber={this.state.modelNumber[this.state.partID]}
                                                partNumber={this.state.partNumber[this.state.partID]}
                                                description={this.state.description[this.state.partID]}
                                                cost={this.state.cost[this.state.partID]}
                                                price={this.state.price[this.state.partID]}
                                                onHand={this.state.onHand[this.state.partID]}
                                                comitted={this.state.comitted[this.state.partID]}/>)

            this.setState({
              partID: this.state.partID + 1,
            })
          }
          return 0
        })
      })
    })
    this.setState({
      quoteNumberOriginal: id
    })
  }

  cancelEdit = (event) => {
    this.setState({
      display: 'none',
      opacity: '1',
      display2: 'none',
      display3: 'none',

      databaseID: [],
      modelNumber: [],
      partNumber: [],
      description: [],
      cost: [],
      price: [],
      onHand: [],
      comitted: [],
      delete: [],
      partData: [],
      partID: 0,

      modelNumberSave: [],
      partNumberSave: [],
      descriptionSave: [],
      costSave: [],
      priceSave: [],
      onHandSave: [],
      comittedSave: [],
      deleteSave: [],
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
      if (document.getElementById(`quote-tableParts-1-delete${i}`) !== null) {
        if (document.getElementById(`quote-tableParts-1-delete${i}`).checked) {
          document.getElementById(`quote-tableParts-1-delete${i}`).checked = false;
          var arr = this.state.partData
          arr[i] = ''
          if (document.getElementById(`quote-tableParts-1-modelNumber${i}`) !== null && document.getElementById(`quote-tableParts-1-modelNumber${i}`).innerHTML !== '') {
            this.state.deleteSave.push(document.getElementById(`quote-tableParts-1-modelNumber${i}`).innerHTML)
          }
          this.setState({partData: arr})
        } else {
          continue
        }
      }
    }
  }

  saveQuote = () => {

    axios.delete(`http://localhost:8000/api/parts/${document.cookie.split(';')[0].split('=')[1]}`, {'data': [this.state.deleteSave, 'notDelete']})

    for (var i = 0; i < this.state.partID; i++) {
      if (document.getElementById(`quote-tableParts-1-modelNumber${i}`) !== null &&
          document.getElementById(`quote-tableParts-1-partNumber${i}`) !== null &&
          document.getElementById(`quote-tableParts-1-description${i}`) !== null &&
          document.getElementById(`quote-tableParts-1-cost${i}`) !== null &&
          document.getElementById(`quote-tableParts-1-price${i}`) !== null &&
          document.getElementById(`quote-tableParts-1-onHand${i}`) !== null &&
          document.getElementById(`quote-tableParts-1-comitted${i}`) !== null) {
            this.state.modelNumberSave.push(document.getElementById(`quote-tableParts-1-modelNumber${i}`).innerHTML)
            this.state.partNumberSave.push(document.getElementById(`quote-tableParts-1-partNumber${i}`).innerHTML)
            this.state.descriptionSave.push(document.getElementById(`quote-tableParts-1-description${i}`).innerHTML)
            this.state.costSave.push(document.getElementById(`quote-tableParts-1-cost${i}`).innerHTML)
            this.state.priceSave.push(document.getElementById(`quote-tableParts-1-price${i}`).innerHTML)
            this.state.onHandSave.push(document.getElementById(`quote-tableParts-1-onHand${i}`).innerHTML)
            this.state.comittedSave.push(document.getElementById(`quote-tableParts-1-comitted${i}`).innerHTML)

            var infoToBeUpdated = {
              'quoteNumberOriginal': this.state.databaseID[i],
              'partQuoteNumber': this.state.quoteNumber,
              'author': document.cookie.split(';')[0].split('=')[1],
              'partModelNumber': this.state.modelNumberSave[i],
              'partNumber': this.state.partNumberSave[i],
              'partDescription': this.state.descriptionSave[i],
              'partCost': this.state.costSave[i],
              'partPrice': this.state.priceSave[i],
              'partQtyOnHand': this.state.onHandSave[i],
              'partQtyCommitted': this.state.comittedSave[i]
            }

            axios.put(`http://localhost:8000/api/parts/${document.cookie.split(';')[0].split('=')[1]}`, infoToBeUpdated).then(res => {

            })

      }

    }
    var updatedHeaderInfo = {
      'author': document.cookie.split(';')[0].split('=')[1],
      'quoteNumberOriginal': this.state.quoteNumberOriginal,
      'quoteNumber': this.state.quoteNumber,
      'createdDate': this.state.createdDate,
      'expectedDate': this.state.expectedDate,
      'customer': this.state.customer,
      'salesperson': this.state.salesperson,
      'company': this.state.company,
      'total': this.state.total,
      'status': this.state.status
    }


    axios.put(`http://localhost:8000/api/quoteList/${document.cookie.split(';')[0].split('=')[1]}`, updatedHeaderInfo).then(res => {
      window.location.href = 'http://localhost:3000/quotes'
    })
    this.setState({
      display: 'none',
      opacity: '1',

      databaseID: [],
      modelNumber: [],
      partNumber: [],
      description: [],
      cost: [],
      price: [],
      onHand: [],
      comitted: [],
      delete: [],
      partData: [],
      partID: 0,

      modelNumberSave: [],
      partNumberSave: [],
      descriptionSave: [],
      costSave: [],
      priceSave: [],
      onHandSave: [],
      comittedSave: [],
      deleteSave: [],
    })
  }

  deleteQuote = (event) => {
    axios.delete(`http://localhost:8000/api/quoteList/${document.cookie.split(';')[0].split('=')[1]}`, {'data':[this.state.quoteNumber]}).then(res => {
      axios.delete(`http://localhost:8000/api/parts/${document.cookie.split(';')[0].split('=')[1]}`, {'data': [this.state.databaseID, 'allDelete']}).then(res => {
        window.location.href = 'http://localhost:3000/quotes'
      })
    })
  }

  // -------------------- Pop Up Page END --------------------

  importScreen = (event) => {
    this.setState({
      display2: 'block',
      opacity: '0.3',
    })
  }

  submitFile = (event) => {
    const formData = new FormData()
    formData.append('files', this.state.file)
    axios.post(`http://localhost:8000/api/uploadFile/${document.cookie.split(';')[0].split('=')[1]}`, formData).then(res => {
      console.log(res)
      this.setState({
        display2: 'none',
        opacity: '1',
      })
      window.location.href = 'http://localhost:3000/quotes'
    })

  }

  handleUpload = (event) => {
    this.setState({
      file: event.target.files[0]
    })
  }

  exportToPDF = (event) => {

    var infoToBePDFed = {
      'quoteNumber': this.state.quoteNumber,
      'customer': this.state.customer,
      'total': this.state.total,
      'createdDate': this.state.createdDate,
      'salesperson': this.state.salesperson,
      'expectedDate': this.state.expectedDate,
      'company': this.state.company,

      'modelNumber': this.state.modelNumber,
      'partNumber': this.state.partNumber,
      'description': this.state.description,
      'cost': this.state.cost,
      'price': this.state.price,
      'onHand': this.state.onHand,
      'comitted': this.state.comitted,
    }

    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(infoToBePDFed)
    }
    fetch(`http://localhost:8000/api/quotePDF/${document.cookie.split(';')[0].split('=')[1]}`, options).then(
      response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = url
          a.download = this.state.quoteNumber
          a.click()
        })
      }
    )

  }

  emailQuote = (event) => {
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
      window.location.href = 'http://localhost:3000/quotes'
    })
  }

  showSearch = (event) => {
    this.setState({
      display5_2: '0.3',
      display5: 'block',
    })

    // const inputSearch = document.getElementById('database_search')

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
        })
      } else if (event.target.value === '') {
        this.setState  ({filterArray:false})
      }
      this.state.filteredData = this.state.uniqueData
      this.state.uniqueData = []
    })
  }

  render() {
    return (
      <>
        <div className='quotes-user' style={{'opacity':this.state.opacity}} style={{'opacity':this.state.display5_2}}>
          <img src={image2} alt=''/>
          <hr id='user-line'></hr>
          <p>{document.cookie.split(';')[0].split('=')[1]}</p>
          <p>{`${document.cookie.split(';')[0].split('=')[1]}@gmail.com`}</p>
        </div>
        <div className='quotes-buttons' style={{'opacity':this.state.opacity}} style={{'opacity':this.state.display5_2}}>
          <div id='quotes-buttons-background-image'>
            <img src={image} alt=''/>
          </div>
          <div id='quotes-buttons-function-buttons' >
            <button id='quotes-button-functions-buttons-create' onClick={this.createQuote}>Create</button>
            <button onClick={this.convertToInvoice} >To Invoice</button>
            <button id='quotes-button-functions-buttons-import' onClick={this.importScreen}>Import</button>
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

        <div className='quotes-quotesTable' style={{'opacity':this.state.opacity}}>
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
                this.state.filterArray ? this.state.filteredData.map(info => <TableTemplate quoteNumber={info.quoteNumber}
                                                          createdDate={info.createdDate}
                                                          expectedDate={info.expectedDate}
                                                          customer={info.customer}
                                                          salesperson={info.salesperson}
                                                          company={info.company}
                                                          total={info.total}
                                                          status={info.status}
                                                          myFunction={this.sendIDtoEditPage}
                                                          id={info.id}/>) : this.state.data.map(info => <TableTemplate quoteNumber={info.quoteNumber}
                                                                                                    createdDate={info.createdDate}
                                                                                                    expectedDate={info.expectedDate}
                                                                                                    customer={info.customer}
                                                                                                    salesperson={info.salesperson}
                                                                                                    company={info.company}
                                                                                                    total={info.total}
                                                                                                    status={info.status}
                                                                                                    myFunction={this.sendIDtoEditPage}
                                                                                                    id={info.id}/>)
              }
              </table>
            </div>
          </div>
          <div id='quotesTable-buttons' style={{'opacity':this.state.opacity}}>
            <button id='quotesTable-buttons-search' onClick={this.showSearch}>{this.state.display5_1 ? "Search" : "Cancel"}</button>
          </div>
        </div>

        <div className='edit-delete-add-quote' style={{'display':this.state.display}}>
          <div id='quote-information'>
            <label style={{'margin-left':'30px'}}>Quote Number</label><input value={this.state.quoteNumber} onChange={e => {this.setState({quoteNumber:e.target.value})}} placeholder='Quote Number' type='text' style={{'margin-left':'18px'}}/>
            <label style={{'margin-left':'20px'}}>Customer</label><input type='text' value={this.state.customer} onChange={e => {this.setState({customer:e.target.value})}} placeholder='Customer' style={{'margin-left':'25px'}}/>
            <label style={{'margin-left':'20px'}}>Total</label><input type='text' value={this.state.total} onChange={e => {this.setState({total:e.target.value})}} placeholder='Total' style={{'margin-left':'20px'}}/><br></br>
            <label style={{'margin-left':'30px'}}>Created Date</label><input type='text' value={this.state.createdDate} disabled placeholder='dd/mm//yyyy'  style={{'margin-left':'32px'}}/>
            <label style={{'margin-left':'20px'}}>Salesperson</label><input type='text' value={this.state.salesperson} onChange={e => {this.setState({salesperson:e.target.value})}} placeholder='Salesperson' style={{'margin-left':'7px'}}/>
            <label style={{'margin-left':'20px'}} >Status</label>
              <select style={{'margin-left':'14px'}} value={this.state.status} onChange={e => {this.setState({status:e.target.value})}}>
                <option value={'Order'}>Order</option>
                <option value={'Done'}>Done</option>
              </select><br></br>
            <label style={{'margin-left':'30px'}}>Expected Date</label><input value={this.state.expectedDate} onChange={e => {this.setState({expectedDate:e.target.value})}} placeholder='dd/mm//yyyy' type='text' style={{'margin-left':'20px'}}/>
            <label style={{'margin-left':'20px'}}>Company</label><input type='text' value={this.state.company} onChange={e => {this.setState({company:e.target.value})}} placeholder='company' style={{'margin-left':'24px'}}/>

          </div>
          <div id='quote-tableParts'>
            <div id='quote-tableParts-1'>
              <table>
                <tr>
                  <th className='quote-tableParts-1-modelNumber'>Model Number</th>
                  <th className='quote-tableParts-1-partNumber'>Part Number</th>
                  <th className='quote-tableParts-1-description'>Description</th>
                  <th className='quote-tableParts-1-cost'>Cost</th>
                  <th className='quote-tableParts-1-price'>Price</th>
                  <th className='quote-tableParts-1-onHand'>On Hand</th>
                  <th className='quote-tableParts-1-comitted'>Comitted</th>
                  <th className='quote-tableParts-1-delete'>Delete</th>
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
            <button onClick={this.saveQuote}>Save Quote</button>
            <button style={{'border-right':'2px solid black'}} onClick={this.cancelEdit}>Cancel</button>
            <button style={{'border-right':'2px solid black'}} onClick={this.addPart}>Add Part</button>
            <button onClick={this.deleteSelected}>Delete Selected</button>
            <button onClick={this.deleteQuote}>Delete Quote</button>
          </div>

          <div id='pdf-email'>
            <button style={{'border-right':'2px solid black'}} onClick={this.exportToPDF}>Export To PDF</button>
            <button onClick={this.emailQuote}>Email Quote</button>
          </div>
        </div>
      </>
    )
  }

}

export default QuotesTable
