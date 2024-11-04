import { instantiate, invoke } from '../xxh3_js/xxh3_js.mjs';
import xxh3_js from '../xxh3_js/xxh3_js.wasm?base64';
import { XXH3WASMInterface } from './interface.ts';

const xxh3_js_module_wasm = xxh3_js;

const xxh3_js_module = await instantiate(WebAssembly.compile(xxh3_js_module_wasm));
if (!xxh3_js_module) throw new Error('Failed to instantiate WASM module: xxh3_js.wasm');

const INTERFACE_BINDING_NAME = '__apollosoftwarexyz_xxh3_interface';

export let _interface: XXH3WASMInterface;
Object.defineProperty(globalThis, INTERFACE_BINDING_NAME, {
  configurable: false,
  enumerable: false,
  get() {
    throw new Error(`Illegal access to interface binding: ${INTERFACE_BINDING_NAME}`);
  },
  set(value) {
    if (!_interface) {
      _interface = value;
    }
  },
});
invoke(xxh3_js_module);
