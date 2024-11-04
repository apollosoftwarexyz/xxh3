# @apollosoftwarexyz/xxh3

A WebAssembly binding of the [xxh3](https://github.com/SamJakob/xxh3) Dart package.

```javascript
import { xxh3String } from '@apollosoftwarexyz/xxh3';

const helloWorldBytes = Buffer.from('Hello, world!', 'utf-8');
console.log(xxh3String(helloWorldBytes));
```

## Implementation

This package simply provides a typed wrapper around the Dart package, which has been compiled to WebAssembly.
Given that the implementation is quite small ~100KiB, the `.wasm` module has been base64-encoded and bundled into the
JavaScript source. This should make the package highly portable to Node-based applications, Deno and the web.

Essentially, this package should run anywhere that has the WebAssembly API and runtime available.

This npm package aims to expose the same API surface as the Dart package (though, where `int` is returned, an ES2020
`BigInt` is returned instead - to work around JavaScript's inherent integer representation limits).

The test suite from the Dart package has been ported to vitest so this WebAssembly implementation matches the 100%
coverage of the Dart xxh3 package against known answers.

## Performance

Performance is equivalent to the pre-optimized performance of the Dart library (i.e., 10x slower than the now current
Dart version) at ~3ns/byte. If you're looking for a more performant hashing algorithm (i.e., you don't specifically need
xxh3, it's probably worth using `sha1` from `node:crypto` instead which performs at about ~0.4ns/byte - so just under
the current Dart version).

Alternatively, it could be worth using FFI bindings at the potential cost of some portability.

WebAssembly support has just landed on Dart stable, so we expect after a few release cycles - particularly if Dart2Wasm
gets used by Flutter - there will be considerable improvements in performance that will lead to improvements here.

The use of `wasm-opt` with `-O3` (`-O4` was not available due to unsupported instructions), led to a ~0.2-0.5ns/byte
improvement in performance.
