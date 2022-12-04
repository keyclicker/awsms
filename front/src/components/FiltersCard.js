import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

export default function FiltersCard({ state }) {
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
              <span className='bi bi-search'></span>
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
