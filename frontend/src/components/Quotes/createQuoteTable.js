import React from 'react'

function CreateQuoteTable(props) {

  return (
    <tr id={`partKey${props.partKey}`}>
      <td id={`groupNumber${props.partKey}`} className='groupNumber' contenteditable='true' ></td>
      <td id={`modelNumber${props.partKey}`} className='modelNumber'  contenteditable='true'></td>
      <td id={`partNumber${props.partKey}`} className='partNumber'  contenteditable='true'></td>
      <td id={`description${props.partKey}`} className='description' contenteditable='true'></td>
      <td id={`cost${props.partKey}`} className='cost' contenteditable='true'></td>
      <td id={`price${props.partKey}`} className='price' contenteditable='true'></td>
      <td id={`qtyOnHand${props.partKey}`} className='qtyOnHand' contenteditable='true'></td>
      <td id={`qtyComitted${props.partKey}`} className='qtyComitted' contenteditable='true'></td>
      <td style={{'text-align':'center'}} className='delete'><input id={`delete${props.partKey}`} type='checkbox'/></td>
    </tr>
  )
}

export default CreateQuoteTable
