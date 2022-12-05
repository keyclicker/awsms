import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

import api from './api/api'
import { GoodModal } from './components/GoodCards'
import Header from './components/Header'

function App() {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState(null)

  useEffect(() => {
    api.session().then((res) => {
      setUser(res.data.user)
    })
  }, [])

  const getCart = () => {
    if (cart === null) setCart(JSON.parse(localStorage.getItem('cart')) || [])
    return cart
  }

  const addToCart = (good) => {
    const newCart = [...cart, good]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (good) => {
    const newCart = cart.filter((g) => g.id !== good.id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const clearCart = () => {
    setCart([])
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const [showModal, setShowModal] = useState(false)
  const [modalGood, setModalGood] = useState(null)

  const state = {
    user,
    setUser,
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    showModal,
    setShowModal,
    modalGood,
    setModalGood,
  }

  return (
    <>
      <Header state={state} />
      <Container fluid='xl'>
        <Outlet context={state} />
      </Container>
      <GoodModal
        good={modalGood}
        show={showModal}
        close={() => setShowModal(false)}
      />
    </>
  )
}

export default App
