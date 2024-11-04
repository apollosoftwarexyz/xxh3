declare module '*/xxh3_js/xxh3_js.mjs' {
  export function instantiate(modulePromise): Promise<WebAssemblyInstantiatedSource>;

  export function invoke(instance: WebAssemblyInstantiatedSource, ...args: unknown);
}

declare module '*.wasm?base64';
