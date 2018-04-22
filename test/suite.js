const assert = require('assert')
const sinon = require('sinon')
const { it } = require('mocha')

const suite = (instantiateStreaming, loader) => {
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

module.exports = suite
