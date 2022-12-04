import { useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Card,
  FormControl,
  Image,
  InputGroup,
  ListGroup,
  Ratio,
  Row,
} from 'react-bootstrap'
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

            <h3>
              <Button variant='primary'>
                <i className='bi bi-bag' /> Add to cart{' '}
              </Button>
              <Badge className='ms-2' bg='secondary'>
                ${good.price}
              </Badge>
            </h3>
          </Card.Body>
        </Row>
      </Card>
    </Col>
  )
}

function StudentsList({ state, good }) {
  return (
    <ListGroup>
      {good.students.map((student, index) => (
        <Student state={state} good={good} student={student} key={index} />
      ))}
    </ListGroup>
  )
}

function Student({ state, good, student }) {
  const [mark, setMark] = useState(student.mark === -1 ? 0 : student.mark)

  const rate = () => {
    client.put('/rate', {
      good_id: good.id,
      student_username: student.username,
      mark,
    })
  }

  const disabled = mark < 0 || mark > 100
  return (
    <ListGroup.Item>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center'>
          <Image src='https://via.placeholder.com/50' roundedCircle />
          <span className='ms-3'>{student.name}</span>
          <span className='ms-2 text-muted'>@{student.username}</span>
          {student.mark !== -1 && (
            <span className='ms-2 text-muted'> {student.mark}/100</span>
          )}
        </div>
        <div className='d-flex align-items-center'>
          {state.user.type === 0 &&
            state.user.username === good.professor.username && (
              <InputGroup>
                <FormControl
                  placeholder='Mark'
                  aria-label='Mark'
                  value={mark}
                  onChange={(e) =>
                    setMark(
                      isNaN(parseInt(e.target.value))
                        ? 0
                        : parseInt(e.target.value)
                    )
                  }
                  aria-describedby='basic-addon2'
                />
                <Button
                  variant='outline-success'
                  id='button-addon2'
                  disabled={disabled}
                  onClick={rate}
                >
                  Rate
                </Button>
              </InputGroup>
            )}
        </div>
      </div>
    </ListGroup.Item>
  )
}
