import { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useOutletContext } from 'react-router-dom'

import api from '../api/api'
import { NarrowGoodCard } from '../components/GoodCards'

export default function SearchPage() {
  let state = useOutletContext()

  const [goods, setGoods] = useState([])

  const [query, setQuery] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [absoluteMinPrice, setAbsoluteMinPrice] = useState(0)
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(1000)
  const [available, setAvailable] = useState(false)
  const [category, setCategory] = useState(true)
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    api
      .search({
        query,
        min_price: minPrice,
        max_price: maxPrice,
        available,
        category,
      })
      .then((res) => {
        setGoods(res.data.list)
        setAbsoluteMinPrice(res.data.minPrice)
        setAbsoluteMaxPrice(res.data.maxPrice)
        setCategoryList(res.data.categories)
      })
  }, [query, minPrice, maxPrice, available, category])

  state = {
    ...state,
    query,
    setQuery,
    goods,
    setGoods,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    absoluteMinPrice,
    setAbsoluteMinPrice,
    absoluteMaxPrice,
    setAbsoluteMaxPrice,
    available,
    setAvailable,
    category,
    setCategory,
    categoryList,
    setCategoryList,
  }

  return (
    <>
      <Row className='mt-3 '>
        <Col xs={{ span: 12 }} lg={{ span: 3 }}>
          <FiltersCard state={state} />
        </Col>

        <Col>
          <Row xs={1} md={3} className='g-3'>
            {goods.map((g, i) => (
              <NarrowGoodCard key={g.id} state={state} good={g} />
            ))}

            {goods.length === 0 && (
              <h3 className='text-center mt-4 text-muted'>Goods not found</h3>
            )}
          </Row>
        </Col>
      </Row>
    </>
  )
}

function FiltersCard({ state }) {
  const min = state.absoluteMinPrice
  const max = state.absoluteMaxPrice
  const step = (max - min) / 100

  const setMax = (e) =>
    state.setMaxPrice(Math.max(e.target.value, state.minPrice))
  const setMin = (e) =>
    state.setMinPrice(Math.min(e.target.value, state.maxPrice))

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
              {state.categoryList.map((c) => (
                <option>{c}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3' controlId='MinPrice'>
            <Form.Label>
              Min Price -{' '}
              <span className='text-primary'>${state.minPrice}</span>
            </Form.Label>
            <Form.Range
              min={min}
              max={max}
              step={step}
              value={state.minPrice}
              onChange={setMin}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='MaxPrice'>
            <Form.Label>
              Max Price -{' '}
              <span className='text-primary'>${state.maxPrice}</span>
            </Form.Label>
            <Form.Range
              min={min}
              max={max}
              step={step}
              value={state.maxPrice}
              onChange={setMax}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Available'>
            <Form.Check
              type='checkbox'
              label='Available'
              value={state.available}
              onChange={(e) => state.setAvailable(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  )
}
