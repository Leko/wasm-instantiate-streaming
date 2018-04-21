# wasm-instantiate-streaming
Polyfill of WebAssembly.instantiateStreaming

> The optimizations we applied can be summarized as follows:
>
> * Use asynchronous APIs to avoid blocking the main thread
> * Use streaming APIs to compile and instantiate WebAssembly modules more quickly
> * Don’t write code you don’t need
>
> &mdash; [Loading WebAssembly modules efficiently  |  Web  |  Google Developers](https://developers.google.com/web/updates/2018/04/loading-wasm)

## Install
```
npm install wasm-instantiate-streaming
```

## Usage
### Using import/require
```js
import { instantiateStreaming } from 'wasm-instantiate-streaming'

// For browser
instantiateStreaming(fetch('some-module.wasm'))

// Use with node-fetch
const fetch = require('node-fetch')
instantiateStreaming(fetch('some-module.wasm'))

// Use with fs module
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
instantiateStreaming(readFile('./some-module.wasm'))
```

### Using without import/require
Please use `build/wasm-instantiate-streaming.min.js`

```html
<script src="path/to/wasm-instantiate-streaming.min.js">
```

```js
instantiateStreaming(fetch('some-module.wasm'))
```

### Pass importsObject
```js
const importObject = {
  imports: {
    imported_func (arg) {
      console.log(arg)
    }
  }
}

instantiateStreaming(fetch('some-module.wasm'), importObject)
```

## API
See MDN document

> &mdash; [WebAssembly.instantiateStreaming() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming)

## Development
```sh
git clone git@github.com:Leko/wasm-instantiate-streaming.git
cd wasm-instantiate-streaming

cd deps/wabt
make
cd ../..

npm install
npm test
```

## License
[MIT](https://opensource.org/licenses/MIT)
