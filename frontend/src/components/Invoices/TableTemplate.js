import React from 'react'
import './Invoices.css'

function TableTemplate(props) {
  return (
    <tr onClick={props.myFunction.bind(this, props.id)}>
      <td id='invoiceNumber'>{props.invoiceNumber}</td>
      <td id='invoice-customer'>{props.customer}</td>
      <td id='invoice-created'>{props.createdDate}</td>
      <td id='invoice-due-date'>{props.dueDate}</td>
      <td id='invoice-total-due'>{props.totalDue}</td>
      <td id='invoice-status'>{props.status}</td>
    </tr>
  )
}

export default TableTemplate
