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
    const localUser = localStorage.getItem('user')
    if (localUser) setUser(JSON.parse(localUser))

    api.session().then((res) => {
      setUser({ ...user, ...res.data })
    })
  }, [])

  const getCart = () => {
    if (cart === null) setCart(JSON.parse(localStorage.getItem('cart')) || [])
    return cart
  }

  const addToCart = (good, count) => {
    const newCart = [...cart, { good, count }]
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (good) => {
    const newCart = cart.filter((g) => g.good.id !== good.id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const updateCountCart = (good, count) => {
    const newCart = cart.map((g) => {
      if (g.good.id === good.id) return { good, count }
      return g
    })
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const clearCart = () => {
    setCart([])
    localStorage.setItem('cart', JSON.stringify([]))
  }

  const [showModal, setShowModal] = useState(false)
  const [modalGood, setModalGood] = useState(null)

  const state = {
    user,
    setUser,
    getCart,
    addToCart,
    removeFromCart,
    updateCountCart,
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
        state={state}
        close={() => setShowModal(false)}
      />
    </>
  )
}

export default App
