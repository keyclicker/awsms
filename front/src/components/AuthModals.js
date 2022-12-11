import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import api from '../api/api'

export function LoginModal({ state, show, close }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = () => {
    api
      .login(username, password)
      .then((res) => {
        const newUser = { ...state.user, ...res.data }
        state.setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        close()
      })
      .catch((err) => {
        alert(err)
      })
  }

  const disabled = username.length < 4 || password.length < 4

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='Username'
              placeholder='Enter email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' disabled={disabled} onClick={onLogin}>
          Log In
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function SignupModal({ state, show, close }) {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const onSignup = () => {
    api
      .signup(username, name, password)
      .then((res) => {
        const newUser = { ...state.user, ...res.data }
        state.setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        close()
      })
      .catch((err) => {
        alert(err)
      })
  }

  const disabled =
    username.length < 4 ||
    password.length < 4 ||
    password !== password2 ||
    name.length < 2

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='formBasicUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='username'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicFullName'>
            <Form.Label>Full name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Full name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword2'>
            <Form.Label>Repeat password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Repeat password'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={onSignup} disabled={disabled}>
          Sign Up
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
