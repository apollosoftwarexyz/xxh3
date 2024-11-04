import { _interface } from './internal/module.ts';

import type { XXH3HashLongFunction } from './internal/interface.ts';

export { XXH3HashLongFunction };

export const kSecretSizeMin = _interface.getKSecretSizeMin();

export interface XXH3Options {
  /**
   * If specified, a custom secret to use for XXH3.
   * This must be at least kSecretSizeMin bytes (136 bytes) in length.
   *
   * See also:
   * - https://pub.dev/documentation/xxh3/latest/xxh3/kSecretSizeMin-constant.html
   */
  secret?: Uint8Array;

  /**
   * If specified, a custom seed to use for XXH3.
   *
   * See also:
   * - https://pub.dev/documentation/xxh3/latest/xxh3/xxh3-library.html
   */
  seed?: number | BigInt;

  /** @see XXH3HashLongFunction */
  hashLongFunction?: XXH3HashLongFunction;
}

/**
 * Perform an XXH3 hash of the input data. The input data is provided as a {@link Uint8Array}, which is converted to a
 * Dart Uint8List.
 *
 * See also:
 * - https://pub.dev/documentation/xxh3/latest/xxh3/xxh3.html
 *
 * @param input The input data to hash.
 * @param options Additional hashing options (can be left as default). See {@link XXH3Options}.
 */
export function xxh3(input: Uint8Array, options: XXH3Options = {}) {
  if (input === null || input === undefined) {
    throw new Error('xxh3: input must not be null or undefined');
  }

  if (options.secret !== undefined && options.secret.byteLength < kSecretSizeMin) {
    throw new Error(`xxh3: ArgumentError: secret must be at least ${kSecretSizeMin} byte(s)`);
  }

  return _interface.xxh3(
    input,
    options.secret ?? null,
    (options.seed as BigInt) ?? null,
    options.hashLongFunction ?? null,
  );
}

/**
 * A convenience wrapper for {@link #xxh3} that returns the result formatted as an unsigned hexadecimal string.
 *
 * See also:
 * - https://pub.dev/documentation/xxh3/latest/xxh3/xxh3String.html
 *
 * @param input The input data to hash.
 * @param options Additional hashing options (can be left as default). See {@link XXH3Options}.
 */
export function xxh3String(input: Uint8Array, options: XXH3Options = {}) {
  if (input === null || input === undefined) {
    throw new Error('xxh3String: input must not be null or undefined');
  }

  if (options.secret !== undefined && options.secret.byteLength < kSecretSizeMin) {
    throw new Error(`xxh3String: ArgumentError: secret must be at least ${kSecretSizeMin} byte(s)`);
  }

  return _interface.xxh3String(
    input,
    options.secret ?? null,
    (options.seed as BigInt) ?? null,
    options.hashLongFunction ?? null,
  );
}
