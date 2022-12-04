import { useState } from 'react'
import { Badge, Button, Card, Form, Ratio, Row, Stack } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'

import client from '../api/client'

export default function GoodCard({ state, good }) {
  const [enrolled, setEnrolled] = useState(
    true
    // state.user && good.students.some((s) => s.username === state.user.username)
  )

  const deleteGood = () => {
    client.delete('/good', { id: good.id })
    state.setGoods(state.goods.filter((c) => c.id !== good.id))
  }

  const enroll = () => {
    client.post('/enroll', { id: good.id })
    setEnrolled(true)
  }

  const unenroll = () => {
    client.delete('/enroll', { id: good.id })
    setEnrolled(false)
  }

  return (
    <Col>
      <Card>
        <Row className='g-0'>
          <Ratio aspectRatio='4x3'>
            <Card.Img fluid rounded src={good.image} />
          </Ratio>

          <Card.Body>
            <Card.Title>{good.name}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              {good.category}
            </Card.Subtitle>
            <Card.Text>{good.description}</Card.Text>

            <Stack direction='horizontal' gap={2}>
              <Button variant='primary'>
                <i className='bi bi-bag' /> Buy
              </Button>
              <Form.Control
                type='number'
                aria-label='Count'
                style={{ width: '60px' }}
              />

              <h4>
                <Badge bg='secondary'>${good.price}</Badge>
              </h4>
            </Stack>
          </Card.Body>
        </Row>
      </Card>
    </Col>
  )
}
