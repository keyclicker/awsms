import client from './client'
import { searchMock, sessionMock } from './mock'

const MOCK_API = false

let prefix = 'http://localhost:800'

//==============================================================================
// Authentication

async function session() {
  let res = sessionMock
  if (!MOCK_API) res = await client.get(prefix + '2/users/me')

  return res
}

//==============================================================================
// Inventory

async function search(body) {
  let res = searchMock
  console.log('hello')
  if (!MOCK_API) res = await client.get(prefix + '0/goods/search', { body })

  return res
}

//==============================================================================
// Payment

export default {
  session,
  search,
}
