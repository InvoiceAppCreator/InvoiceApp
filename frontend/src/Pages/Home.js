import React from 'react'
import Nav from '../components/Home/Nav'
import Welcome from '../components/Home/Welcome'

function Home() {

  return (
    <>
      <Nav/>
      <Welcome user={document.cookie.split(';')[0].split('=')[1]}/>
    </>
  )
}

export default Home
