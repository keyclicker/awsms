import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Ratio,
  Row,
  Stack,
} from 'react-bootstrap'

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

export function GoodCard({ state, good, disabled }) {
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
                {!disabled && (
                  <Button variant='danger'>
                    <i className='bi bi-bag-x' />
                  </Button>
                )}

                <Form.Control
                  disabled={disabled}
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

export function GoodModal({ show, close, good }) {
  if (!good) return null

  return (
    <Modal show={show} onHide={close} centered size='lg'>
      <Modal.Body>
        <Row>
          <Col sm={5}>
            <Image
              rounded
              fluid
              className='w-100 mb-2 align-self-center'
              src={good.image}
            />
          </Col>
          <Col sm={7}>
            <h3 className='mb-0'>{good.name}</h3>
            <h5 className='text-secondary'>{good.category}</h5>

            <h6 className='text-secondary mt-2 mb-3'>{good.description}</h6>

            {good.specs.map(({ key, value }, i) => (
              <h6 key={i}>
                <span className='text-secondary'>{key}: </span>
                {value}
              </h6>
            ))}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction='horizontal' gap={2}>
          <h4>
            <Badge bg='secondary'>${good.price}</Badge>
          </h4>
          <Form.Control
            type='number'
            aria-label='Count'
            style={{ width: '80px' }}
          />
          <Button variant='primary'>
            <i className='bi bi-bag' /> Buy
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  )
}
