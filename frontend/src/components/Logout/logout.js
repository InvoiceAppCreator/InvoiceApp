import React from 'react'

function logout() {

  document.cookie=`username=&token=&firstName=&lastName=&email=`

  window.location.href = 'http://localhost:3000/login'

  return (
    <div></div>
  )
}

export default logout
