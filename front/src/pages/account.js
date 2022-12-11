import { useEffect, useState } from 'react'
import { Accordion, Button, Col, Image, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useNavigate, useOutletContext } from 'react-router-dom'

import api from '../api/api'
import { GoodCard } from '../components/GoodCards'

export default function AccountPage() {
  let state = useOutletContext()

  const [orders, setOrders] = useState([])

  useEffect(() => {
    api
      .getUserOrders()
      .then((res) => {
        setOrders(res.data)
      })
      .catch((err) => {
        alert(err)
      })
  }, [])

  return (
    <Row className='mt-3 '>
      <Col>
        <h2>Orders</h2>

        <Accordion defaultActiveKey={[0]} alwaysOpen>
          {(orders?.map &&
            orders.map((o, i) => (
              <Accordion.Item eventKey={i}>
                <Accordion.Header>
                  <div className='d-flex justify-content-between w-100'>
                    <div>
                      Order #{o.id}
                      <span className='ms-2 text-secondary'>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </div>
                    <div className='me-4 text-secondary'>
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row xs={1} md={2} className='g-3'>
                    {o.goods?.map((g) => (
                      <GoodCard
                        key={g.id}
                        state={state}
                        good={g.good}
                        disabled={true}
                        forceCount={g.count}
                      />
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))) || (
            <h3 className='text-center mt-4 text-muted'>Orders not found</h3>
          )}
        </Accordion>
      </Col>

      <Col xs={{ span: 12 }} lg={{ span: 3 }}>
        <AccountCard state={state} />
      </Col>
    </Row>
  )
}

function AccountCard({ state }) {
  const navigate = useNavigate()
  const logout = () => {
    state.setUser(null)
    localStorage.removeItem('user')
    navigate('/search')
  }

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
              src={state.user.image || 'https://picsum.photos/300/300'}
            />
            <h3 className='mb-0'>{state.user.full_name || 'John Doe'}</h3>
            <h5 className='text-secondary'>
              @{state.user.username || 'johndoe'}
            </h5>
            <h6>
              <span className='text-secondary'>Email: </span>
              {state.user.email || 'johndoe@johndoe.com'}
            </h6>
            <h6>
              <span className='text-secondary'>Phone: </span>
              {state.user.phone || '+380990000000'}
            </h6>
            <h6>
              <span className='text-secondary'>Country: </span>
              {state.user.country || 'USA'}
            </h6>
            <h6>
              <span className='text-secondary'>City: </span>
              {state.user.city || 'John Doe City'}
            </h6>
            <h6>
              <span className='text-secondary'>Street: </span>
              {state.user.address || '1234 John Doe St.'}
            </h6>
            <h6>
              <span className='text-secondary'>Zip: </span>
              {state.user.zip || '22842'}
            </h6>
          </Card.Body>

          <Card.Footer>
            <Button
              className='w-100'
              variant='secondary'
              type='submit'
              onClick={logout}
            >
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
