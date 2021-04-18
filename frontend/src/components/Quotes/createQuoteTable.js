import React from 'react'

function CreateQuoteTable(props) {

  return (
    <tr id={`partKey${props.partKey}`}>
      <td id={`modelNumber${props.partKey}`} className='modelNumber'  contentEditable='true'></td>
      <td id={`partNumber${props.partKey}`} className='partNumber'  contentEditable='true'></td>
      <td id={`description${props.partKey}`} className='description' contentEditable='true'></td>
      <td id={`cost${props.partKey}`} className='cost' contentEditable='true'></td>
      <td id={`price${props.partKey}`} className='price' contentEditable='true'></td>
      <td id={`qtyOnHand${props.partKey}`} className='qtyOnHand' contentEditable='true'></td>
      <td id={`qtyComitted${props.partKey}`} className='qtyComitted' contentEditable='true'></td>
      <td style={{'text-align':'center'}} className='delete'><input id={`delete${props.partKey}`} type='checkbox'/></td>
    </tr>
  )
}

export default CreateQuoteTable
