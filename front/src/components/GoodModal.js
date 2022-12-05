import { Badge, Col, Form, Image, Row, Stack } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export function GoodModal({ state, show, close, good }) {
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
