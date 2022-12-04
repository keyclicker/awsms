import { useEffect, useState } from 'react'

import api from './api/api'
import Header from './components/Header'
import SearchPage from './pages/search'

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
      <SearchPage state={state} />
    </>
  )
}

export default App
