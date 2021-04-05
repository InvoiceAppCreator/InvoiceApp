import React from 'react'
import './Quotes.css'

function EditTable(props) {
  return (
    <tr>
      <td className='quote-tableParts-1-modelNumber' id={`quote-tableParts-1-modelNumber${props.partKey}`} contenteditable='true'>{props.modelNumber}</td>
      <td className='quote-tableParts-1-partNumber' id={`quote-tableParts-1-partNumber${props.partKey}`} contenteditable='true'>{props.partNumber}</td>
      <td className='quote-tableParts-1-description' id={`quote-tableParts-1-description${props.partKey}`} contenteditable='true'>{props.description}</td>
      <td className='quote-tableParts-1-cost' id={`quote-tableParts-1-cost${props.partKey}`} contenteditable='true'>{props.cost}</td>
      <td className='quote-tableParts-1-price' id={`quote-tableParts-1-price${props.partKey}`} contenteditable='true'>{props.price}</td>
      <td className='quote-tableParts-1-onHand' id={`quote-tableParts-1-onHand${props.partKey}`} contenteditable='true'>{props.onHand}</td>
      <td className='quote-tableParts-1-comitted' id={`quote-tableParts-1-comitted${props.partKey}`} contenteditable='true'>{props.comitted}</td>
      <td className='quote-tableParts-1-delete'><input id={`quote-tableParts-1-delete${props.partKey}`} type='checkbox'/></td>
    </tr>
  )
}

export default EditTable
