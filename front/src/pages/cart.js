import { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { useOutletContext } from 'react-router-dom'

import api from '../api/api'
import { GoodCard } from '../components/GoodCards'

export default function CartPage() {
  let state = useOutletContext()

  const [goods, setGoods] = useState([])

  useEffect(() => {
    api.search('').then((res) => {
      setGoods(res.data.list)
    })
  }, [])

  state = {
    ...state,
  }

  return (
    <Row className='mt-3 '>
      <Col>
        <h2>Cart</h2>
        <Row xs={1} md={2} className='g-3'>
          {state.getCart()?.map((g, i) => (
            <GoodCard key={g.id} state={state} good={g} />
          ))}

          {goods.length === 0 && (
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
  const [street, setStreet] = useState(state?.user?.street || '')
  const [zip, setZip] = useState(state?.user?.zip || '')

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
  const handleCheckout = () => {
    console.log('checkout')
  }

  return (
    <Card className='position-fixed-lg mb-3'>
      <Card.Header>Checkout</Card.Header>
      <Form>
        <Card.Body>
          <Form.Group className='mb-3' controlId='MinPrice'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              placeholder='Country'
              value={country}
              onChange={handleCountry}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='MinPrice'>
            <Form.Label>City</Form.Label>
            <Form.Control
              placeholder='City'
              value={city}
              onChange={handleCity}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='MinPrice'>
            <Form.Label>Street</Form.Label>
            <Form.Control
              placeholder='Street'
              value={street}
              onChange={handleStreet}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='MinPrice'>
            <Form.Label>Postal</Form.Label>
            <Form.Control
              placeholder='Postal'
              value={zip}
              onChange={handleZip}
            />
          </Form.Group>

          <h3>
            Total: <span className='text-success'>$40000</span>
          </h3>
        </Card.Body>
        <Card.Footer>
          <Button className='w-100' variant='primary' type='submit'>
            Ckeckout
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}
