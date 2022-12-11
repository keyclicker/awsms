import { useState } from 'react'
import { Button, Container, Image, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { LoginModal, SignupModal } from './AuthModals'

export default function Header({ state }) {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <Navbar bg='dark' variant='dark' sticky='top'>
        <Container fluid='xl' className='justify-content-between'>
          <Link className='no-decoration' to='/search'>
            <Navbar.Brand>
              awsms<i className='bi bi-search fs-6 ms-3'></i>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            {/*{state.user ? (*/}
            <Link to='/cart'>
              <Button variant='primary'>
                <i className='bi bi-bag' />
              </Button>
            </Link>
            {state.user ? (
              <Link to='/account'>
                <Image
                  role='button'
                  roundedCircle
                  fluid
                  src={state.user.image || 'https://picsum.photos/200'}
                  className='ms-3'
                  style={{ width: '38px', height: '38px' }}
                ></Image>
              </Link>
            ) : (
              <>
                <Button
                  variant='primary'
                  className='ms-3'
                  onClick={() => setShowSignup(true)}
                >
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
            )}
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
