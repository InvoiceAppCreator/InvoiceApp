import React from 'react'
import axios from 'axios'

function logout() {

  axios({
    method: 'DELETE',
    url: `http://localhost:8000/api/deleteToken/${document.cookie.split('&')[0].split('=')[1]}`,
    headers: {
      Authorization: document.cookie.split('&')[1].split('=')[1]
    }
  }).then(res => {
    document.cookie=`username=&token=&firstName=&lastName=&email=`
    document.location.href = 'http://localhost:3000/login'
  })

  return (
    <>Logging Out...</>
  )
}

export default logout
