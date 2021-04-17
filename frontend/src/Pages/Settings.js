import React, {Component} from 'react'
import '../components/Settings/settings.css'
import axios from 'axios'
import sha256 from 'crypto-js/sha256';

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: document.cookie.split('&')[2].split('=')[1],
      lastName: document.cookie.split('&')[3].split('=')[1],
      username: document.cookie.split('&')[0].split('=')[1],
      password: '',
      email:  document.cookie.split('&')[4].split('=')[1],

      passwordChange: '',
      passwordChangeConfirm: '',

      profilePicture: null,
      backgroundPicture: null,

      profilePictureUpdate: null,
      backgroundPictureUpdate: null,

      usernameCookie: document.cookie.split('&')[0].split('=')[1],
      token: document.cookie.split('&')[1].split('=')[1],

      serverDomain: 'http://localhost:8000',
      clientDomain: 'http://localhost:3000'
    }
  }

  // GETTING PROFILE AND BACKGROUND IMAGES
  componentDidMount() {
    document.title = 'Settings'
    axios({
      method: 'GET',
      url: `${this.state.serverDomain}/api/userImages/${this.state.usernameCookie}`,
      headers: {
        Authorization: this.state.token
      }
    }).then(res => {
      this.setState({
        profilePicture:`${this.state.serverDomain}${res.data[0].profilePicture}`,
        backgroundPicture:`${this.state.serverDomain}${res.data[0].backgroundPicture}`,
      })
    })
  }

  // SEND DATA TO BE UPDATED
  updateAccount = (event) => {

    // ALL USER INFORMATION
    var firstName = document.getElementById('firstName-settings').innerHTML
    var lastName = document.getElementById('lastName=settings').innerHTML
    var email = document.getElementById('email-settings').innerHTML
    var username = document.getElementById('username-settings').innerHTML
    if (firstName === this.state.firstName && lastName === this.state.lastName && email === this.state.email && username === this.state.username ) {
      var user_info_bool = false
    } else {
      var user_info_bool = true
      var user_info = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
      }
    }

    // ALL PASSWORD INFORMATION
    if (this.state.password !== '' && this.state.passwordChange !== '' && this.state.passwordChangeConfirm !== '') {
      if (this.state.passwordChange === this.state.passwordChangeConfirm) {
        var password_change_bool = true
        var passwordChange = {
          oldPassword: sha256(this.state.password).toString(),
          newPassword: sha256(this.state.passwordChange).toString(),
          confirmNewPassword: sha256(this.state.passwordChangeConfirm).toString(),
        }
      } else {
        alert("Password Mismatch")
      }
    } else if (this.state.password === '' && this.state.passwordChange === '' && this.state.passwordChangeConfirm === '') {
        var password_change_bool = false
    } else {
      password_change_bool = false
      alert("Fill Out All Password Fields")
    }

    // ALL FILES INFORMATION
    const formData = new FormData()
    if (this.state.profilePictureUpdate !== null || this.state.backgroundPictureUpdate !== null) {
      var pictures_bool = true
      if (this.state.profilePictureUpdate === null) {
        this.state.profilePictureUpdate = this.state.profilePicture
        formData.append('profilePicture_Bool', false)
      } else {
          formData.append('profilePicture', this.state.profilePictureUpdate)
          formData.append('profilePicture_Bool', true)
      }
      if (this.state.backgroundPictureUpdate === null) {
        this.state.backgroundPictureUpdate = this.state.backgroundPicture
        formData.append('backgroundPicture_Bool', false)
      } else {
        formData.append('backgroundPicture', this.state.backgroundPictureUpdate)
        formData.append('backgroundPicture_Bool', true)
      }
    } else {
      pictures_bool = false
    }

    // USER UPDATING
    if (user_info_bool) {
      axios({
        method:'PUT',
        url: `${this.state.serverDomain}/api/updateUser/${this.state.usernameCookie}`,
        data: user_info,
        headers: {
          Authorization: this.state.token
        }
      }).then(res => {
        var resD = res.data['data']
        var tokenR = res.data['TOKEN']
        document.cookie=`username=${resD[0].username}&token=${tokenR}&firstName=${resD[0].firstName}&lastName=${resD[0].lastName}&email=${resD[0].email}`
        window.location.href = `${this.state.clientDomain}/settings`
      })
    }

    // PASSWORD UPDATING
    if (password_change_bool) {
      axios({
        method: 'PUT',
        url: `${this.state.serverDomain}/api/updatePassword/${this.state.usernameCookie}`,
        data: passwordChange,
        headers: {
          Authorization: this.state.token
        }
      }).then(res => {
        if (res.data['Status'] == 'Wrong') {
          alert("You Entered Incorrect Password")
        } else {
          var tokenR = res.data['TOKEN']
          document.cookie=`username=${this.state.username}&token=${tokenR}&firstName=${this.state.firstName}&lastName=${this.state.lastName}&email=${this.state.email}`
          window.location.href = `${this.state.clientDomain}/settings`
        }
      })
    }

    // IMAGE UPDATING
    if (pictures_bool) {
      axios({
        method: 'PUT',
        url: `${this.state.serverDomain}/api/updatePictures/${this.state.usernameCookie}`,
        data: formData,
        headers: {
          Authorization: this.state.token
        }
      }).then(res => {
        window.location.href = `${this.state.clientDomain}/settings`
      })
    }
  }

  // DELETE ACCOUNT
  deleteAccount = (event) => {
    if(window.confirm('Are you Sure?')) {
      axios({
        method: 'DELETE',
        url: `${this.state.serverDomain}/api/updateUser/${this.state.usernameCookie}`,
        headers: {
          Authorization: this.state.token
        }
      }).then(res => {
          document.cookie=`username=&token=&firstName=&lastName=&email=`
          window.location.href = `${this.state.clientDomain}/login`
      })
    }
  }

  render() {
    return (
      <>
        <nav className='quotes-nav'>
            <h1 id='nav-header'>Settings</h1>
            <div id='nav-nav'>
              <p style={{'margin-left':'24px'}}><a href='/quotes'>Quotes&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/invoices'>Invoices&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/home'>Home&nbsp;</a> <a href='/#'>|&nbsp;</a> <a href='/logout'>Logout&nbsp;</a></p>
            </div>
        </nav>

        <div className='main-settings-div'>
            <img id='backgroundPicture' src={this.state.backgroundPicture}/>
            <img id='profilePicture' src={this.state.profilePicture}/>

              <div className='name-headers'>
                <table>
                  <tr>
                    <td id='firstName-settings' spellcheck="false" contenteditable='true'>{this.state.firstName}</td>
                    <td id='lastName=settings' spellcheck="false" contenteditable='true'>{this.state.lastName}</td>
                  </tr>
                </table>
              </div>
              <div className='email-header'>
                <table>
                  <tr>
                    <td id='email-settings' spellcheck="false" contenteditable='true'>{this.state.email}</td>
                  </tr>
                </table>
              </div>
              <div className='username-header'>
                <table>
                  <tr>
                    <td id='username-settings' spellcheck="false" contenteditable='true'>{this.state.username}</td>
                  </tr>
                </table>
              </div>

            <hr></hr>

            <div className='password-div'>
              <label>Old Password</label><input type='password' placeholder='Old Password' value={this.state.password} onChange={e => this.setState({password:e.target.value})}/><br></br>
              <label>New password</label><input type='password' placeholder='New Password' value={this.state.passwordChange} onChange={e => this.setState({passwordChange:e.target.value})}/><br></br>
              <label>Confirm Password</label><input style={{'margin-left':'12px'}} type='password' placeholder='Confirm Password' value={this.state.passwordChangeConfirm} onChange={e => this.setState({passwordChangeConfirm:e.target.value})}/><br></br>
            </div>

            <hr></hr>

            <div className='pics'>
              <label>Profile</label><input id='profile-pic' accept=".png, .jpg, .jpeg" type='file' onChange={e => this.setState({profilePictureUpdate:e.target.files[0]})}/><br></br>
              <label>Background</label><input id='background-pic' accept=".png, .jpg, .jpeg" type='file' onChange={e => this.setState({backgroundPictureUpdate:e.target.files[0]})}/>
            </div>

            <hr></hr>

            <button id='save-button' onClick={this.updateAccount}>Save Section</button>
            <button id='delete-button' onClick={this.deleteAccount}>Delete Account</button>

        </div>

      </>
    )
  }
}

export default Settings
