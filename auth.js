const { request } = require('https')
module.exports = require('./auth-handler.js')({ hostname: 'github.com', request })
