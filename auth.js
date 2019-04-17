const { URL } = require('url')
const { request } = require('https')

const fromEntries =
  Object.fromEntries ||
  (iter => Object.assign(...[...iter].map(([k, v]) => ({ [k]: v }))))

const parseUrlFormEncoded = form => fromEntries(new URLSearchParams(form))
const stringifyUrlFormEncoded = from => new URLSearchParams(form).toString()

const client_id = 'bc9a4b96852fb49c7cb9'
const client_secret = process.env.SECRET

module.exports = (req, res) => {
  const { state, code } = parseUrlFormEncoded(new URL(`/${req.url}`))
  const bodyParams = { client_id, client_secret, state, code }
  const body = stringifyUrlFormEncoded(bodyParams)
  const options = {
    hostname: 'github.com',
    port: 443,
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    }
  }
  const req = request(options, githubRes => {
    githubRes.pause()
    // githubRes.headers['access-control-allow-origin'] = '*'
    res.writeHeader(githubRes.statusCode, githubRes.headers)
    githubRes.pipe(res, { end: true })
    githubRes.resume()
  })
  req.write(body)
  req.end()
}
