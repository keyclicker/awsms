import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

import api from './api/api'
import Header from './components/Header'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.session().then((res) => {
      setUser(res.data.user)
    })
  }, [])

  const state = {
    user,
    setUser,
  }

  return (
    <>
      <Header state={state} />
      <Container fluid='xl'>
        <Outlet context={state} />
      </Container>
    </>
  )
}

export default App
