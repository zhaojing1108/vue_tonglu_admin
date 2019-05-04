'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://172.16.100.201:8000"'
  //BASE_API: '"http://192.168.123.226:8000"'
})
