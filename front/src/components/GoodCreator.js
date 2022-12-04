import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import client from '../api/client'

export function GoodCreator({ state }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const createGood = () => {
    client.post('/good', {
      name,
      description,
    })

    state.setGoods([
      {
        professor: state.user,
        name,
        description,
      },
      ...state.goods,
    ])
    state.setShowCreator(false)
    setName('')
    setDescription('')
  }

  const cancelCreation = () => {
    state.setShowCreator(false)
    setName('')
    setDescription('')
  }

  return (
    <Card>
      <Card.Header as='h5'>Create goods</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
            <Form.Label>Good name</Form.Label>
            <Form.Control
              onChange={(e) => setName(e.target.value)}
              value={name}
              type='text'
              placeholder='Good name'
              autoFocus
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Good description</Form.Label>
            <Form.Control
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              as='textarea'
              rows={3}
            />
          </Form.Group>
        </Form>
      </Card.Body>
      <Card.Footer
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'end',
        }}
      >
        <Button variant='secondary' onClick={cancelCreation}>
          Cancel
        </Button>
        <Button variant='primary' className='ms-2' onClick={createGood}>
          Create
        </Button>
      </Card.Footer>
    </Card>
  )
}
