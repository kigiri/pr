const { URL } = require('url')
const { request } = require('http')

const fromEntries =
  Object.fromEntries ||
  (iter => Object.assign({}, ...[...iter].map(([k, v]) => ({ [k]: v }))))

const stringifyUrlFormEncoded = params => new URLSearchParams(params).toString()

const client_id = 'bc9a4b96852fb49c7cb9'
const client_secret = process.env.SECRET

module.exports = ({ hostname, port = 443, protocol = 'https:' }) => (req, res) => {
  const url = new URL(`http://a${req.url}`)
  const { state, code } = fromEntries(url.searchParams)
  const bodyParams = { client_id, client_secret, state, code }
  const body = stringifyUrlFormEncoded(bodyParams)
  const options = {
    port,
    hostname,
    protocol,
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    }
  }
  const githubReq = request(options, githubRes => {
    githubRes.pause()
    // githubRes.headers['access-control-allow-origin'] = '*'
    res.writeHeader(githubRes.statusCode, githubRes.headers)
    githubRes.pipe(res, { end: true })
    githubRes.resume()
  })
  githubReq.write(body)
  githubReq.end()
}