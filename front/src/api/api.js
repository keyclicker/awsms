import client from './client'

const MOCK_API = false

let prefix = '/'

async function request(path, body) {
  let res = await client.post(prefix + path, body)
  return res
}

//==============================================================================
// Authentication
async function signup(username, full_name, password) {
  return await request('authentication/signup', {
    username,
    full_name,
    password,
  })
}

async function login(username, password) {
  return await request('authentication/login', {
    username,
    password,
  })
}

async function logout(token) {
  return await request('authentication/logout', {})
}

async function session() {
  return await request('authentication/me')
}
//==============================================================================
// Inventory

async function search(query, category, min_price, max_price, available) {
  return await request('inventory/search', {
    query,
    category,
    min_price,
    max_price,
    available,
  })
}

async function categories() {
  return await request('inventory/categories')
}

async function createGood(
  name,
  image,
  price,
  category,
  description,
  count,
  specs
) {
  return await request('inventory/create', {
    name,
    image,
    price,
    category,
    description,
    count,
    specs,
  })
}

async function deleteGood(good_id) {
  return await request('inventory/delete/' + good_id)
}

async function updateGood(
  id,
  name,
  image,
  price,
  category,
  description,
  count,
  specs
) {
  return await request('inventory/update', {
    id,
    name,
    image,
    price,
    category,
    description,
    count,
    specs,
  })
}

//==============================================================================
// Payment

async function checkout(
  user_username,
  phone_number,
  country,
  city,
  street,
  zip,
  goods
) {
  return await request('payment/create', {
    user_username,
    phone_number,
    country,
    city,
    street,
    zip,
    goods,
  })
}

async function getUserOrders() {
  return await request('payment/user')
}

export default {
  session,
  search,
  signup,
  login,
  logout,
  categories,
  checkout,
  createGood,
  getUserOrders,
  deleteGood,
  updateGood,
}
