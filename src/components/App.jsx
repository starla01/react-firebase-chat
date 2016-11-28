import React, { Component } from 'react'
import firebase from 'firebase'

import Header from './Header'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

class App extends Component {
  constructor () {
    super()
    this.state = {
      messages: [],
      user: null
    }
  }

  componentWillMount () {
    const database = firebase.database().ref().child('messages')

    database.on('child_added', snap => {
      this.setState({
        messages: this.state.messages.concat(snap.val())
      })
    })

    firebase.auth().onAuthStateChanged(user => {
      console.log(user)
      if (user) {
        this.setState({ user })
      } else {
        this.setState({ user: null })
      }
    })
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/plus.login')

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleLogout () {
    firebase.auth().signOut()
      .then(result => console.log('Te has desconectado correctamente'))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleSendMessage (event) {
    event.preventDefault()
    const database = firebase.database().ref().child('messages')

    let message = database.push()
    let msg = {
      text: event.target.text.value,
      avatar: this.state.user.photoURL,
      displayName: this.state.user.displayName,
      date: Date.now()
    }
    message.set(msg)
  }

  renderMessages () {
    setTimeout(() => {
      console.log('caca')
    }, 2000)
  }

  render () {
    return (
      <div>
        <Header
          appName='Chat Real'
          user={this.state.user}
          onAuth={this.handleAuth.bind(this)}
          onLogout={this.handleLogout.bind(this)}
        />
        <div className='message-chat-list container'>
          <span>
            Bienvenid@ al chat de los Reyes Magos. Antes de que
            puedas enviarnos tu carta, te haremos unas preguntas
            para ver que tal te has portado...
          </span>
          <br/><br/>
          {this.state.messages.map(msg => (
            <ChatMessage message={msg} />
          )).reverse()}
        </div>
        <ChatInput
          onSendMessage={this.handleSendMessage.bind(this)}
        />
      </div>
    )
  }
}

export default App
