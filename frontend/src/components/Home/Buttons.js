import React from 'react'
import './Home.css'

function Buttons() {

  function goToQuotes() {
    window.location.href = '/quotes'
  }

  function goToInvoices() {
    window.location.href = '/invoices'
  }

  return (
      <div className='home-buttons'>
          <button id='buttons-quotes' onClick={goToQuotes}>Quotes</button>
          <button id='buttons-invoices' onClick={goToInvoices}>Invoices</button>
      </div>
  )

}

export default Buttons
