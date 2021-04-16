import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Login.css'
import axios from 'axios'
import sha256 from 'crypto-js/sha256';


function LoginBody() {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  function submitLogintoDB(event) {
    const passwordData = sha256(password).toString()
    const usernameData = username
    var data = {username:usernameData, login:true, password:passwordData}
    axios.post('http://localhost:8000/api/users/', data).then(res => {
      var userData = res.data
      if (userData['message'] === 'Success') {
        document.cookie=`username=${username}&token=${userData['TOKEN']}&firstName=${userData['firstName']}&lastName=${userData['lastName']}&email=${userData['email']}`
        window.location.href = 'http://localhost:3000/home/'
        console.log(document.cookie)
      } else if (userData['message'] === 'Wrong') {
          alert('Incorrect Login')
      }
    })
    event.preventDefault();
  }

  return (
      <div className='login-main-body'>
        <form onSubmit={submitLogintoDB}>
          <label>Username</label><br></br>
          <input type='text' value={username} onChange={e => setUsername(e.target.value)} /><br></br>
          <label id='login-password'>Password</label><br></br>
          <input type='password' value={password} onChange={e => setPassword(e.target.value)}/><br></br>
          <button>Login</button>
        </form>
        <Link to='/signup'><p>Signup</p></Link>
      </div>
  )
}

export default LoginBody
