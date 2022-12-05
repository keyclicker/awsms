import { Badge, Button, Card, Form, Ratio, Row, Stack } from 'react-bootstrap'
import Col from 'react-bootstrap/Col'

export function NarrowGoodCard({ state, good }) {
  const deleteFromCart = () => {}

  const addToCart = () => {}

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
                style={{ width: '80px' }}
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

export function GoodCard({ state, good }) {
  return (
    <Col>
      <Card>
        <Row className='g-0'>
          <Col sm={4}>
            <Ratio aspectRatio='1x1'>
              <Card.Img fluid rounded src={good.image} />
            </Ratio>
          </Col>

          <Col sm={8}>
            <Card.Body>
              <Card.Title>{good.name}</Card.Title>
              <Card.Subtitle className='mb-2 text-muted'>
                {good.category}
              </Card.Subtitle>
              <Card.Text>{good.description}</Card.Text>

              <Stack direction='horizontal' gap={2}>
                <Button variant='danger'>
                  <i className='bi bi-bag-x' /> Delete
                </Button>
                <Form.Control
                  type='number'
                  aria-label='Count'
                  style={{ width: '80px' }}
                />

                <h4>
                  <Badge bg='secondary'>${good.price}</Badge>
                </h4>
              </Stack>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  )
}
