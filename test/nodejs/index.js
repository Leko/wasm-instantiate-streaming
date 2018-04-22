const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { describe, it, before, after } = require('mocha')
const StaticServer = require('static-server')
const fetch = require('node-fetch')
const { promisify } = require('es6-promisify')
const { instantiateStreaming } = require('../../index')
const suite = require('../suite')

if (typeof WebAssembly !== 'undefined') {
  describe('instantiateStreaming', () => {
    describe('node-fetch', () => {
      const PORT = process.env.PORT || 8888

      let server
      before(() => {
        server = new StaticServer({
          rootPath: path.join(__dirname, '..', 'fixtures'),
          port: PORT,
        })
        return promisify(server.start.bind(server))()
      })
      after(() => {
        server.stop()
      })

      suite(instantiateStreaming, (wasmName) => fetch(`http://localhost:${PORT}/${wasmName}`))
    })

    describe('fs', () => {
      const readFile = promisify(fs.readFile)

      suite(instantiateStreaming, (wasmName) => readFile(path.join(__dirname, '..', 'fixtures', wasmName)))
    })
  })
} else {
  describe('instantiateStreaming (in environment that WebAssembly is not supported)', () => {
    it('must reject Promise', () => {
      return instantiateStreaming()
        .then(() => assert.fail('must must be reject instantiateStreaming in environment that WebAssembly is not supported'))
        .catch(() => assert.ok(true))
    })
  })
}
