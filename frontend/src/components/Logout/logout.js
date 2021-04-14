import React from 'react'

function logout() {

  document.cookie = document.cookie=`username=`

  window.location.href = 'http://localhost:3000/login'


  return (
    <div></div>
  )
}

export default logout
