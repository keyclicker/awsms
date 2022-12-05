import { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useOutletContext } from 'react-router-dom'

import api from '../api/api'
import { NarrowGoodCard } from '../components/GoodCards'
import { GoodCreator } from '../components/GoodCreator'

export default function SearchPage() {
  let state = useOutletContext()

  const [query, setQuery] = useState('')
  const [goods, setGoods] = useState([])
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    api.search(query).then((res) => {
      setGoods(res.data.list)
    })
  }, [query])

  state = {
    ...state,
    query,
    setQuery,
    goods,
    setGoods,
    showCreator,
    setShowCreator,
  }

  return (
    <Row className='mt-3 '>
      <Col xs={{ span: 12 }} lg={{ span: 3 }}>
        <FiltersCard state={state} />
        {state?.user?.type === 0 && !showCreator && (
          <Button className='w-100' onClick={() => setShowCreator(true)}>
            Create Goods
          </Button>
        )}
      </Col>

      <Col>
        <Row xs={1} md={3} className='g-3'>
          {state?.user?.type === 0 && showCreator && (
            <GoodCreator state={state} />
          )}

          {goods.map((g, i) => (
            <NarrowGoodCard key={g.id} state={state} good={g} />
          ))}

          {goods.length === 0 && (
            <h3 className='text-center mt-4 text-muted'>Goods not found</h3>
          )}
        </Row>
      </Col>
    </Row>
  )
}

function FiltersCard({ state }) {
  return (
    <Card className='position-fixed-lg mb-3'>
      <Card.Header>Filters</Card.Header>
      <Card.Body>
        <Form>
          <InputGroup className='mb-3'>
            <Form.Control
              placeholder='Search'
              aria-label='Search'
              aria-describedby='Search'
              value={state.query}
              onChange={(e) => state.setQuery(e.target.value)}
            />
            <Button variant='outline-secondary' id='button-addon2'>
              <i className='bi bi-search' />
            </Button>
          </InputGroup>

          <Form.Group className='mb-3' controlId='Category'>
            <Form.Label>Category</Form.Label>
            <Form.Select aria-label='Category'>
              <option value={true}>All Categories</option>
              <option value={false}>My goods</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3' controlId='MinPrice'>
            <Form.Label>Min Price</Form.Label>
            <Form.Range />
          </Form.Group>
          <Form.Group className='mb-3' controlId='MaxPrice'>
            <Form.Label>Max Price</Form.Label>
            <Form.Range />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Available'>
            <Form.Check type='checkbox' label='Available' />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}
