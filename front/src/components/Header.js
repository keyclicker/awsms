import { useState } from 'react'
import {
  Button,
  Container,
  Image,
  Navbar,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap'

import client from '../api/client'
import { LoginModal, SignupModal } from './AuthModals'

export default function Header({ state }) {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const logout = () => {
    client.post('/logout').then((res) => {
      state.setUser(null)
    })
  }

  const popover = state.user ? (
    <Popover id='popover-basic'>
      <Popover.Header as='h3'>{state.user.name}</Popover.Header>
      <Popover.Body>
        <div className='text-center mb-3'>@{state.user.username}</div>
        <div className='text-center mb-3'>
          {state.user.type ? 'Admin' : 'Customer'}
        </div>

        <Button variant='primary' onClick={logout}>
          Log Out
        </Button>
      </Popover.Body>
    </Popover>
  ) : (
    <></>
  )

  return (
    <>
      <Navbar bg='dark' variant='dark' sticky='top'>
        <Container fluid='xl' className='justify-content-between'>
          <Navbar.Brand href='#home'>awsms</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            {/*{state.user ? (*/}
            {state.user && (
              <OverlayTrigger
                trigger='click'
                placement='bottom'
                overlay={popover}
              >
                <Image
                  role='button'
                  roundedCircle
                  fluid
                  src={state.user.image}
                  style={{ width: '38px', height: '38px' }}
                ></Image>
              </OverlayTrigger>
            )}
            // ) : (
            <>
              <Button variant='primary' onClick={() => setShowSignup(true)}>
                Sign Up
              </Button>
              <Button
                variant='light'
                className='ms-3'
                onClick={() => setShowLogin(true)}
              >
                Log In
              </Button>
            </>
            {/*)}*/}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <SignupModal
        state={state}
        show={showSignup}
        close={() => setShowSignup(false)}
      />
      <LoginModal
        state={state}
        show={showLogin}
        close={() => setShowLogin(false)}
      />
    </>
  )
}
