import { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { useNavigate, useOutletContext } from 'react-router-dom'

import api from '../api/api'
import { GoodCard } from '../components/GoodCards'

export default function CartPage() {
  let state = useOutletContext()

  state = {
    ...state,
  }

  const cart = state.getCart()

  return (
    <Row className='mt-3 '>
      <Col>
        <h2>Cart</h2>

        <Row xs={1} md={2} className='g-3'>
          {cart?.length > 0 ? (
            cart?.map((g, i) => (
              <GoodCard key={g.good.id} state={state} good={g.good} />
            ))
          ) : (
            <h3 className='text-center mt-4 text-muted'>Goods not found</h3>
          )}
        </Row>
      </Col>

      <Col xs={{ span: 12 }} lg={{ span: 3 }}>
        <CheckoutCard state={state} />
      </Col>
    </Row>
  )
}

function CheckoutCard({ state }) {
  // states
  const [country, setCountry] = useState(state?.user?.country || '')
  const [city, setCity] = useState(state?.user?.city || '')
  const [street, setStreet] = useState(state?.user?.address || '')
  const [zip, setZip] = useState(state?.user?.zip || '')
  const [phone, setPhone] = useState(state?.user?.phone || '')

  // handlers
  const handleCountry = (e) => {
    setCountry(e.target.value)
  }
  const handleCity = (e) => {
    setCity(e.target.value)
  }
  const handleStreet = (e) => {
    setStreet(e.target.value)
  }
  const handleZip = (e) => {
    setZip(e.target.value)
  }

  const handlePhone = (e) => {
    setPhone(e.target.value)
  }

  const goods =
    state.getCart()?.map((g) => {
      return { good_id: g.good.id, count: g.count }
    }) || []

  const navigate = useNavigate()
  const handleCheckout = () => {
    api
      .checkout(
        state?.user?.username,
        state?.user?.phone,
        country,
        city,
        street,
        zip,
        goods
      )
      .then((res) => {
        state.clearCart()
      })
      .catch((err) => {
        alert(err)
      })
    navigate('/search')
  }

  const cartPrice = state
    .getCart()
    ?.reduce((acc, g) => acc + g.good.price * g.count, 0)

  return (
    <Card className='position-fixed-lg mb-3'>
      <Card.Header>Checkout</Card.Header>
      <Form>
        <Card.Body>
          <Form.Group className='mb-3' controlId='Phone'>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              placeholder='Phone'
              value={phone}
              onChange={handlePhone}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='Country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              placeholder='Country'
              value={country}
              onChange={handleCountry}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='City'>
            <Form.Label>City</Form.Label>
            <Form.Control
              placeholder='City'
              value={city}
              onChange={handleCity}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='Street'>
            <Form.Label>Street</Form.Label>
            <Form.Control
              placeholder='Street'
              value={street}
              onChange={handleStreet}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='Postal'>
            <Form.Label>Postal</Form.Label>
            <Form.Control
              placeholder='Postal'
              value={zip}
              onChange={handleZip}
            />
          </Form.Group>

          <h3>
            Total: <span className='text-success'>${cartPrice}</span>
          </h3>
        </Card.Body>
        <Card.Footer>
          <Button
            className='w-100'
            variant='primary'
            type='submit'
            onClick={handleCheckout}
          >
            Ckeckout
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}
