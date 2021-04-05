import React from 'react'

function CreateConvertTable(props) {

  return (
    <tr id={`partKey${props.partKey}`}>
      <td id={`invoice-convert-itemCode${props.partKey}`} className='invoice-convert-itemCode'>{props.itemCode}</td>
      <td id={`invoice-convert-description${props.partKey}`} className='invoice-convert-description' >{props.description}</td>
      <td id={`invoice-convert-quantity${props.partKey}`} className='invoice-convert-quantity' >{props.quantity}</td>
      <td id={`invoice-convert-unitPrice${props.partKey}`} className='invoice-convert-unitPrice'>{props.unitPrice}</td>
      <td id={`invoice-convert-totalPrice${props.partKey}`} className='invoice-convert-totalPrice'>{props.total.toFixed(2)}</td>
    </tr>
  )
}

export default CreateConvertTable
