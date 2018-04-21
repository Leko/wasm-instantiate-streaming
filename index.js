// global WebAssembly

function toUint8Array (buff) {
  var u = new Uint8Array(buff.length)
  for (var i = 0; i < buff.length; ++i) {
    u[i] = buff[i]
  }
  return u
}

function toArrayBuffer (response) {
  // browser, node-fetch
  if (typeof response.arrayBuffer === 'function') {
    return response.arrayBuffer()

  // Node.js
  } else {
    return Promise.resolve(toUint8Array(response))
  }
}

function preferCompile (arrayBuffer) {
  if (WebAssembly.compile) {
    return WebAssembly.compile(arrayBuffer)
  } else {
    return Promise.resolve(new WebAssembly.Module(arrayBuffer))
  }
}

function preferInstantiate (wasmModule, importObject) {
  if (WebAssembly.compile) {
    return WebAssembly.instantiate(wasmModule, importObject)
  } else {
    return Promise.resolve(new WebAssembly.Module(wasmModule))
  }
}

function ponyfill () {
  if (typeof WebAssembly === 'undefined') {
    return function instantiateStreaming () {
      return Promise.reject(new Error('WebAssembly is not supported'))
    }
  }
  if (WebAssembly.instantiateStreaming) {
    return WebAssembly.instantiateStreaming.bind(WebAssembly)
  }

  /**
   * Ponyfill of WebAssembly.instantiateStreaming
   *
   * @param Promise<Response> source
   * @param Object [importObject={}]
   * @return Promise<{ module: WebAssembly.Module, instance: WebAssembly.Instance }> A Promise that resolves to a ResultObject which contains two fields
   * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming
   */
  function instantiateStreaming (source, importObject) {
    importObject = importObject || {}
    return source.then(toArrayBuffer)
      .then(preferCompile)
      .then(mod => {
        return preferInstantiate(mod, importObject)
          .then(instance => {
            return {
              module: mod,
              instance: instance,
            }
          })
      })
  }

  return instantiateStreaming
}

module.exports = {
  instantiateStreaming: ponyfill(),
}
