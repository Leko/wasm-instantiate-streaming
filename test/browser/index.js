const assert = require('assert')
const sinon = require('sinon')
const { describe, it, before, after } = require('mocha')
const { instantiateStreaming } = require('../../index')
const suite = require('../suite')

if (typeof WebAssembly !== 'undefined') {
  describe('instantiateStreaming', function () {
    describe('browser', function () {
      suite(function (wasmName) {
        return fetch(`http://localhost:7777/${wasmName}`)
      })
    })
  })
} else {
  describe('instantiateStreaming (in environment that WebAssembly is not supported)', function () {
    it('must reject Promise', function () {
      return instantiateStreaming()
        .then(function () { assert.fail() })
        .catch(function () { assert.ok(true) })
    })
  })
}
