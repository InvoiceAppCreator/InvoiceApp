import React from 'react'
import './Quotes.css'

function TableTemplate(props) {
  return (
    <tr onClick={props.myFunction.bind(this, props.id)}>
      <td id='quoteNumber'>{props.quoteNumber}</td>
      <td id='createDate'>{props.createdDate}</td>
      <td id='expectDate'>{props.expectedDate}</td>
      <td id='customers'>{props.customer}</td>
      <td id='salesperson'>{props.salesperson}</td>
      <td id='company'>{props.company}</td>
      <td id='total'>{props.total}</td>
      <td id='status'>{props.status}</td>
    </tr>
  )
}

export default TableTemplate
