import { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

import api from '../api/api'
import FiltersCard from '../components/FiltersCard'
import GoodCard from '../components/GoodCard'
import { GoodCreator } from '../components/GoodCreator'

export default function SearchPage({ state }) {
  const [query, setQuery] = useState('')
  const [goods, setGoods] = useState([])
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    api.search(query).then((res) => {
      setGoods(res.data)
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
    <Container fluid='xl'>
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
              <GoodCard key={g.id} state={state} good={g} />
            ))}

            {goods.length === 0 && (
              <h3 className='text-center mt-4 text-muted'>Goods not found</h3>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
