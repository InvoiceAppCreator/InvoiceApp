import React from 'react'
import Nav from '../components/Home/Nav'
import Welcome from '../components/Home/Welcome'

function Home() {
    document.title = 'Home'
  return (
    <>
      <Nav/>
      <Welcome user={`${document.cookie.split('&')[2].split('=')[1]} ${document.cookie.split('&')[3].split('=')[1]}`}/>
    </>
  )
}

export default Home
