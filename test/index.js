const fs = require('fs')
const path = require('path')
const assert = require('assert')
const sinon = require('sinon')
const { describe, it, before, after } = require('mocha')
const StaticServer = require('static-server')
const fetch = require('node-fetch')
const { promisify } = require('es6-promisify')
const { instantiateStreaming } = require('../index')

const suite = (loader) => {
  it('returns object that contains module', () => {
    return instantiateStreaming(loader('no-deps.wasm'))
      .then(result => {
        assert.notEqual(typeof result.module, 'undefined')
      })
  })
  it('returns object that contains instance', () => {
    return instantiateStreaming(loader('no-deps.wasm'))
      .then(result => {
        assert.notEqual(typeof result.instance, 'undefined')
      })
  })
  it('can pass importObject', () => {
    const imports = {
      imports: {
        imported_func: n => n,
      }
    }
    return instantiateStreaming(loader('with-deps.wasm'), imports)
      .then(result => {
        assert.notEqual(typeof result.instance, 'undefined')
      })
  })
  it('can add works', () => {
    return instantiateStreaming(loader('no-deps.wasm'))
      .then(({ instance }) => {
        assert.equal(instance.exports.add(1, 2), 3)
      })
  })
  it('can exported_func works', () => {
    const arg = 135
    const stub = sinon.stub()
    const imports = {
      imports: {
        imported_func: stub,
      }
    }
    return instantiateStreaming(loader('with-deps.wasm'), imports)
      .then(({ instance }) => {
        instance.exports.exported_func(arg)
        assert.ok(stub.calledWith(arg))
      })
  })
}

describe('instantiateStreaming', () => {
  describe('node-fetch', () => {
    const PORT = process.env.PORT || 8888

    let server
    before(() => {
      server = new StaticServer({
        rootPath: path.join(__dirname, 'fixtures'),
        port: PORT,
      })
      return promisify(server.start.bind(server))()
    })
    after(() => {
      server.stop()
    })

    suite((wasmName) => fetch(`http://localhost:${PORT}/${wasmName}`))
  })

  describe('fs', () => {
    const readFile = promisify(fs.readFile)

    suite((wasmName) => readFile(path.join(__dirname, 'fixtures', wasmName)))
  })
})
