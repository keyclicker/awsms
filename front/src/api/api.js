import client from './client'
import { searchMock, sessionMock } from './mock'

const MOCK_API = true

async function session() {
  let res = sessionMock
  if (!MOCK_API) res = await client.get('/session')

  return res
}

async function search(query) {
  let res = searchMock
  if (!MOCK_API) res = await client.get('/search', { params: { query } })

  return res
}

export default {
  session,
  search,
}
