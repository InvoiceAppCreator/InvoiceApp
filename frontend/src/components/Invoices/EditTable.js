import React from 'react'
import './Invoices.css'

function EditTable(props) {
  return (
    <tr>
      <td className='invoice-tableParts-1-itemCode' id={`invoice-tableParts-1-itemCode${props.partKey}`} contenteditable='true'>{props.itemCode}</td>
      <td className='invoice-tableParts-1-description' id={`invoice-tableParts-1-descriptionr${props.partKey}`} contenteditable='true'>{props.description}</td>
      <td className='invoice-tableParts-1-quantity' id={`invoice-tableParts-1-quantity${props.partKey}`} contenteditable='true'>{props.quantity}</td>
      <td className='invoice-tableParts-1-unitPrice' id={`invoice-tableParts-1-unitPrice${props.partKey}`} contenteditable='true'>{props.unitPrice}</td>
      <td className='invoice-tableParts-1-totalPrice' id={`invoice-tableParts-1-totalPrice${props.partKey}`} contenteditable='true'>{props.totalPrice}</td>
      <td className='invoice-tableParts-1-delete'><input id={`invoice-tableParts-1-delete${props.partKey}`} type='checkbox'/></td>
    </tr>
  )
}

export default EditTable
