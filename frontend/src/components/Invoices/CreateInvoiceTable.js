import React from 'react'
import './CreateInvoiceTable.css'

function CreateInvoiceTable(props) {

  return (
    <tr id={`partKey${props.partKey}`}>
      <td id={`invoice-convert-itemCode${props.partKey}`} className='invoice-convert-itemCode' contenteditable='true'></td>
      <td id={`invoice-convert-description${props.partKey}`} className='invoice-convert-description' contenteditable='true'></td>
      <td id={`invoice-convert-quantity${props.partKey}`} className='invoice-convert-quantity' contenteditable='true'></td>
      <td id={`invoice-convert-unitPrice${props.partKey}`} className='invoice-convert-unitPrice' contenteditable='true'></td>
      <td id={`invoice-convert-totalPrice${props.partKey}`} className='invoice-convert-totalPrice' contenteditable='true'></td>
      <td style={{'text-align':'center'}} className='invoice-create-delete'><input id={`invoice-create-delete${props.partKey}`} type='checkbox'/></td>
    </tr>
  )
}

export default CreateInvoiceTable
