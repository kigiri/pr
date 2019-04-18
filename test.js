const { request, get, createServer } = require('http')
const port = 6546
process.env.SECRET = 'pouet'

const test = require('./auth-handler.js')({ hostname: 'localhost', port, request })
createServer(async (req, res) => {
  console.log(req.url)
  if (req.url === '/login/oauth/access_token') {
    const data = []
    for await (const d of req) {
      data.push(d)
    }
    const params = new URLSearchParams(data.join(''))
    console.log(params)
    res.end('OK')
  } else {
    test(req, res)
  }
}).listen(6546, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  get(`http://localhost:${port}/`)
})

// test()


.now.sh 
