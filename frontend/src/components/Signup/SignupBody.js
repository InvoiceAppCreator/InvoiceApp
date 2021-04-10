import React, {useState} from 'react'
import './Signup.css'
import axios from 'axios'
import sha256 from 'crypto-js/sha256';

function SignupBody() {

  const [firstName, changeFirstName] = useState()
  const [lastName, changeLastName] = useState()
  const [username, changeUsername] = useState()
  const [email, changeEmail] = useState()
  const [password, changePassword] = useState()
  const [confirm_password, changeConfirmPassword] = useState()


  function submitDataToDB(event) {
    if (password === [confirm_password] && password.length > 0 && confirm_password.length > 0) {
      var data = {
        login: false,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: sha256(confirm_password).toString()
      }
      document.cookie=`username=${username}`
      axios.post('http://localhost:8000/api/users/', data).then(res => {
        console.log(res);
        window.location.href = 'http://localhost:3000/home/'
      })

    } else if (password !== confirm_password) {
      alert('Password MisMatch')
    } else if (password.length === 0 || confirm_password.length === 0) {
      alert("Enter Password")
    }
    event.preventDefault()
  }

  return (
    <div className='signup-main-body'>

      <form onSubmit={submitDataToDB}>
        <label>First Name</label><br></br>
        <input type='text' value={firstName} onChange={e => changeFirstName(e.target.value)}/><br></br><br></br>

        <label>Last Name</label><br></br>
        <input type='text' value={lastName} onChange={e => changeLastName(e.target.value)}/><br></br><br></br>

        <label>Username</label><br></br>
        <input type='text' value={username} onChange={e => changeUsername(e.target.value)} /><br></br><br></br>

        <label id='signup-email' >Email</label><br></br>
        <input type='text' value={email} onChange={e => changeEmail(e.target.value)}/><br></br><br></br>

        <label id='signup-password'>Password</label><br></br>
        <input type='password' value={password} onChange={e => changePassword(e.target.value)}/><br></br><br></br>

        <label id='signup-confirm-password'>Confirm Password</label><br></br>
        <input type='password' value={confirm_password} onChange={e => changeConfirmPassword(e.target.value)} /><br></br>

        <button>Signup</button>
      </form>
    </div>
  )
}

export default SignupBody
