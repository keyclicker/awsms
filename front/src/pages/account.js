import { useEffect, useState } from 'react'
import { Accordion, Button, Col, Image, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useOutletContext } from 'react-router-dom'

import api from '../api/api'
import { GoodCard } from '../components/GoodCards'

export default function AccountPage() {
  let state = useOutletContext()

  const [goods, setGoods] = useState([])

  useEffect(() => {
    api.search('').then((res) => {
      setGoods(res.data.list)
    })
  }, [])

  return (
    <Row className='mt-3 '>
      <Col>
        <h2>Orders</h2>

        <Accordion defaultActiveKey={[0]} alwaysOpen>
          {goods.map((g, i) => (
            <Accordion.Item eventKey={i}>
              <Accordion.Header>Order #{i}</Accordion.Header>
              <Accordion.Body>
                <Row xs={1} md={2} className='g-3'>
                  <GoodCard key={g.id} state={state} good={g} />
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {goods.length === 0 && (
          <h3 className='text-center mt-4 text-muted'>Goods not found</h3>
        )}
      </Col>

      <Col xs={{ span: 12 }} lg={{ span: 3 }}>
        <AccountCard state={state} />
      </Col>
    </Row>
  )
}

function AccountCard({ state }) {
  return (
    <Card className='position-fixed-lg mb-3'>
      <Card.Header>Account</Card.Header>
      {state.user ? (
        <>
          <Card.Body>
            <Image
              rounded
              fluid
              className='w-100 mb-2 align-self-center'
              src={state.user.image}
            />
            <h3 className='mb-0'>{state.user.name}</h3>
            <h5 className='text-secondary'>@{state.user.username}</h5>
            <h6>
              <span className='text-secondary'>Email: </span>
              {state.user.email}
            </h6>
            <h6>
              <span className='text-secondary'>Country: </span>
              {state.user.country}
            </h6>
            <h6>
              <span className='text-secondary'>City: </span>
              {state.user.city}
            </h6>
            <h6>
              <span className='text-secondary'>Street: </span>
              {state.user.street}
            </h6>
            <h6>
              <span className='text-secondary'>Zip: </span>
              {state.user.zip}
            </h6>
          </Card.Body>

          <Card.Footer>
            <Button className='w-100' variant='secondary' type='submit'>
              Logout
            </Button>
          </Card.Footer>
        </>
      ) : (
        <div>loading</div>
      )}
    </Card>
  )
}
