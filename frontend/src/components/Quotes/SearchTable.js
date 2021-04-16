import React from 'react'
import './ConvertToInvoice.css'

function SearchTable(props) {
  return (
    <tr onClick={props.getQuote.bind(this, props.quoteNumber)}>
      <td>{props.quoteNumber}</td>
      <td style={{'text-align':'right'}}>{props.customer}</td>
    </tr>
  )
}

export default SearchTable
