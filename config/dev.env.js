'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
<<<<<<< HEAD
  // BASE_API: '"http://172.16.100.201:8000"'
  BASE_API: '"http://192.168.123.226:8000"'
=======
  BASE_API: '"http://172.16.100.201:8000"'
  //BASE_API: '"http://192.168.123.226:8000"'
>>>>>>> 020281bf1b54bedf675a4d8758aadd4476cc49e4
})
