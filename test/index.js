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
  it('returns object that contains module', async () => {
    const result = await instantiateStreaming(loader('no-deps.wasm'))
    assert.notEqual(typeof result.module, 'undefined')
  })
  it('returns object that contains instance', async () => {
    const result = await instantiateStreaming(loader('no-deps.wasm'))
    assert.notEqual(typeof result.instance, 'undefined')
  })
  it('can pass importObject', async () => {
    const imports = {
      imports: {
        imported_func: n => n,
      }
    }
    const result = await instantiateStreaming(loader('with-deps.wasm'), imports)
    assert.notEqual(typeof result.instance, 'undefined')
  })
  it('can add works', async () => {
    const { instance } = await instantiateStreaming(loader('no-deps.wasm'))
    assert.equal(instance.exports.add(1, 2), 3)
  })
  it('can exported_func works', async () => {
    const arg = 135
    const stub = sinon.stub()
    const imports = {
      imports: {
        imported_func: stub,
      }
    }
    const { instance } = await instantiateStreaming(loader('with-deps.wasm'), imports)
    instance.exports.exported_func(arg)
    assert.ok(stub.calledWith(arg))
  })
}

describe('instantiateStreaming', () => {
  describe('node-fetch', () => {
    const PORT = process.env.PORT || 8888

    let server
    before(async () => {
      server = new StaticServer({
        rootPath: path.join(__dirname, 'fixtures'),
        port: PORT,
      })
      await promisify(server.start.bind(server))()
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
