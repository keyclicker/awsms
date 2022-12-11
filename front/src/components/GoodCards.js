import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CloseButton,
  Col,
  Form,
  Image,
  Modal,
  Ratio,
  Row,
  Stack,
} from 'react-bootstrap'

import api from '../api/api'

const clamp = (num, min, max) => Math.min(Math.max(parseInt(num), min), max)

function isGoodInCart(good, cart) {
  return cart?.some((c) => c.good?.id === good?.id)
}

function goodCount(good, cart) {
  return cart?.find((c) => c.good?.id === good?.id)?.count || 0
}

export function NarrowGoodCard({ state, good }) {
  const [count, setCount] = useState(goodCount(good, state.getCart()))
  const [showModal, setShowModal] = useState(false)
  const [modalGood, setModalGood] = useState(null)
  const isInCart = isGoodInCart(good, state.getCart())

  const handleDelete = () => {
    api
      .deleteGood(good.id)
      .then(() => {
        state.setGoods(state.goods.filter((g) => g.id !== good.id))
        state.removeFromCart(good)
        setCount(0)
      })
      .catch((err) => {
        alert(err)
      })
  }

  return (
    <Col>
      <Card>
        <Row className='g-0 position-relative'>
          <Ratio aspectRatio='4x3'>
            <Card.Img
              fluid
              rounded
              src={good.image}
              onClick={(e) => {
                state.setModalGood(good)
                state.setShowModal(true)
              }}
            />
          </Ratio>

          {state.user?.role === 'admin' && (
            <>
              <CloseButton
                className='position-absolute top-0 end-0 bg-secondary'
                onClick={handleDelete}
              />

              <Button
                variant='secondary'
                className='position-absolute top-0 start-0 p-0'
                style={{ width: '25px', height: '25px', alpha: 0.5 }}
                onClick={(e) => {
                  setModalGood(good)
                  setShowModal(true)
                }}
              >
                <i className='bi bi-pen-fill fs-6' />
              </Button>

              <GoodCreateModal
                state={state}
                good={modalGood}
                show={showModal}
                close={() => {
                  setShowModal(false)
                  setModalGood(null)
                }}
              />
            </>
          )}

          <Card.Body>
            <Card.Title>{good.name}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>
              {good.category}
            </Card.Subtitle>
            <Card.Text>{good.description}</Card.Text>

            <Stack direction='horizontal' gap={2}>
              {isInCart ? (
                <Button
                  variant='danger'
                  onClick={(e) => {
                    state.removeFromCart(good)
                  }}
                >
                  <i className='bi bi-bag-x' />
                </Button>
              ) : (
                <Button
                  variant='primary'
                  disabled={count === 0}
                  onClick={(e) => {
                    state.addToCart(good, count)
                  }}
                >
                  <i className='bi bi-bag' /> Buy
                </Button>
              )}

              <Form.Control
                disabled={good.count === 0}
                type='number'
                aria-label='Count'
                style={{ width: '80px' }}
                value={count}
                onChange={(e) => {
                  setCount(clamp(e.target.value, 0, good.count))
                  state.updateCountCart(
                    good,
                    clamp(e.target.value, 0, good.count)
                  )
                }}
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

export function GoodCard({ state, good, disabled, forceCount }) {
  const [count, setCount] = useState(goodCount(good, state.getCart()))

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
                  <Button
                    variant='danger'
                    onClick={(e) => {
                      state.removeFromCart(good)
                    }}
                  >
                    <i className='bi bi-bag-x' />
                  </Button>
                )}

                <Form.Control
                  disabled={disabled}
                  type='number'
                  aria-label='Count'
                  style={{ width: '80px' }}
                  value={forceCount || count}
                  onChange={(e) => {
                    setCount(clamp(e.target.value, 0, good.count))
                    state.updateCountCart(
                      good,
                      clamp(e.target.value, 0, good.count)
                    )
                  }}
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

export function GoodModal({ show, close, good, state }) {
  const [count, setCount] = useState(goodCount(good, state.getCart()))

  useEffect(() => {
    setCount(goodCount(good, state.getCart()))
  }, [show])

  const isInCart = isGoodInCart(good, state.getCart())

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
            value={count}
            onChange={(e) => {
              setCount(clamp(e.target.value, 0, good.count))
              state.updateCountCart(good, clamp(e.target.value, 0, good.count))
            }}
          />
          {isInCart ? (
            <Button
              variant='danger'
              onClick={(e) => {
                state.removeFromCart(good)
              }}
            >
              <i className='bi bi-bag-x' />
            </Button>
          ) : (
            <Button
              variant='primary'
              disabled={count === 0}
              onClick={(e) => {
                state.addToCart(good, count)
              }}
            >
              <i className='bi bi-bag' /> Buy
            </Button>
          )}
        </Stack>
      </Modal.Footer>
    </Modal>
  )
}

export function GoodCreateModal({ show, close, state, good }) {
  const [id, setId] = useState(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [count, setCount] = useState(1)
  const [image, setImage] = useState('')
  const [specs, setSpecs] = useState([])

  const reset = () => {
    console.log(good?.id)
    setId(good ? good.id : null)
    setName(good ? good.name : '')
    setCategory(good ? good.category : '')
    setDescription(good ? good.description : '')
    setPrice(good ? good.price : 0)
    setCount(good ? good.count : 1)
    setImage(good ? good.image : '')
    setSpecs(good ? good.specs : [])
  }
  const closeAndReset = () => {
    reset()
    close()
  }

  useEffect(() => {
    reset()
  }, [show])

  const handleGood = () => {
    if (good) {
      api
        .updateGood(id, name, image, price, category, description, count, specs)
        .then(() => {
          closeAndReset()
        })
        .catch((err) => {
          alert(err)
        })
    } else {
      api
        .createGood(name, image, price, category, description, count, specs)
        .then((good) => {
          closeAndReset()
        })
        .catch((err) => {
          alert(err)
        })
    }

    // add good to the state
    state.research()
  }

  return (
    <Modal show={show} onHide={closeAndReset} centered size='lg'>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3' controlId='Name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              placeholder='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Photo'>
            <Form.Label>Photo</Form.Label>
            <Form.Control
              placeholder='Photo'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Count'>
            <Form.Label>Count</Form.Label>
            <Form.Control
              type='number'
              placeholder='Count'
              value={count}
              onChange={(e) =>
                setCount(e.target.value > 0 ? e.target.value : 0)
              }
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Price'
              value={price}
              onChange={(e) =>
                setPrice(e.target.value > 0 ? e.target.value : 0)
              }
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='Spec'>
            <Form.Label>Specs</Form.Label>
            {specs.map(({ key, value }, i) => (
              <Row key={i} className='mb-2'>
                <Col>
                  <Form.Control
                    placeholder='Key'
                    value={key}
                    onChange={(e) => {
                      const newSpecs = [...specs]
                      newSpecs[i].key = e.target.value
                      setSpecs(newSpecs)
                    }}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder='Value'
                    value={value}
                    onChange={(e) => {
                      const newSpecs = [...specs]
                      newSpecs[i].value = e.target.value
                      setSpecs(newSpecs)
                    }}
                  />
                </Col>
              </Row>
            ))}

            <Row className='mb-2'>
              <Col>
                <Button
                  variant='danger'
                  className='w-100'
                  onClick={(e) => {
                    setSpecs(specs.slice(0, -1))
                  }}
                >
                  Remove
                </Button>
              </Col>
              <Col>
                <Button
                  variant='primary'
                  className='w-100'
                  onClick={(e) => {
                    setSpecs([...specs, { key: '', value: '' }])
                  }}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={handleGood}>
          {good ? 'Update' : 'Create'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
