import client from './client'

function mock(data) {
  return {
    status: 200,
    data: data,
    headers: 'headers',
    url: 'mock.com',
  }
}

async function session() {
  // let res = await client.get('/session')

  return mock({
    user: {
      id: 1,
      type: 0,
      image: 'https://picsum.photos/300/300',
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@johndoe.com',
      address: '1234 John Doe St',
    },
  })
}

async function search(query) {
  // let res = await client.get(`/search?q=${query}`)

  return mock([
    {
      id: 1,
      image:
        'https://www.okirobo.com/wp-content/uploads/sites/24/2021/10/new_macbook_pro_specs.jpg',
      name: 'Macbook Pro 2022',
      category: 'laptop',
      price: 4500,
      description: 'Good budget laptop',
      specs: [
        { key: 'CPU', value: 'Apple M2 Pro Ultra Max' },
        { key: 'RAM', value: '32GB' },
        { key: 'Storage', value: '1TB SSD' },
      ],
    },
    {
      id: 2,
      image:
        'https://www.case-custom.com/media/catalog/product/cache/custom-google-pixel-6-pro-clear-case-image-1000x1000/67757632-doge-meme-custom-google-pixel-6-pro-clear-case.jpg',
      name: 'Google Pixel 6',
      category: 'phone',
      price: 1000,
      description: 'Not an iPhone',
      specs: [
        { key: 'CPU', value: 'Google G6 Max' },
        { key: 'RAM', value: '8GB' },
        { key: 'Storage', value: '512GB' },
      ],
    },
    {
      id: 3,
      image:
        'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iozrPB08rQ0g/v0/1200x801.jpg',
      name: 'Apple Watch 15',
      category: 'watch',
      price: 500,
      description: 'You will be too lazy to charge it',
      specs: [
        { key: 'CPU', value: 'Apple A20 Pro Ultra Max' },
        { key: 'RAM', value: '32GB' },
        { key: 'Storage', value: '10TB SSD' },
      ],
    },
    {
      id: 4,
      image: 'https://i.redd.it/vj2y0wvqpfu71.jpg',
      name: 'Apple AirPods 3',
      category: 'headphone',
      price: 200,
      description: 'Just like AirPods 2 but with a brand new name',
      specs: [
        { key: 'CPU', value: 'Apple A20 Pro Ultra Max' },
        { key: 'RAM', value: '64GB' },
        { key: 'Storage', value: '10TB SSD' },
      ],
    },
    {
      id: 5,
      image: 'https://i.kym-cdn.com/photos/images/newsfeed/001/333/066/9ad.jpg',
      name: 'Oculus Quest 3',
      category: 'vr-helmet',
      price: 1000,
      description: 'One night stand for 1000 bucks',
      specs: [{ key: 'CPU', value: 'Meta Fucks U3 Duo' }],
    },
    {
      id: 6,
      image:
        'https://vamers-com.exactdn.com/wp-content/uploads/2019/12/Vamers-Technology-Gaming-The-Internet-responds-to-Microsofts-new-console-with-Xbox-Series-X-memes-Banner.jpg?strip=all&lossy=1&ssl=1',
      name: 'Xbox Series X',
      category: 'console',
      price: 500,
      description: 'For those who does not have a PC',
    },
  ])
}

export default {
  session,
  search,
}
