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
        <InputGroup className='mb-3'>
          <FormControl
            placeholder='Search'
            aria-label='Search'
            aria-describedby='Search'
            value={state.query}
            onChange={(e) => state.setQuery(e.target.value)}
          />
          <Button variant='outline-secondary' id='button-addon2'>
            <i className='bi bi-search'></i>
          </Button>
        </InputGroup>

        {state.user && (
          <Form.Select aria-label='Select filter'>
            <option value={false}>All goods</option>
            <option value={true}>My goods</option>
          </Form.Select>
        )}
      </Card.Body>
    </Card>
  )
}
