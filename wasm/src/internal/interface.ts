/**
 * When hashing inputs of length greater than 240, the {@link XXH3HashLongFunction} is used.
 * The default is kXXH3HashLongFunction64Bit.
 *
 * See also:
 * - https://pub.dev/documentation/xxh3/latest/xxh3/HashLongFunction.html
 * - https://pub.dev/documentation/xxh3/latest/xxh3/kXXH3HashLongFunction64Bit-constant.html
 */
export type XXH3HashLongFunction = (input: DataView, seed: BigInt, secret: DataView) => BigInt;

export interface XXH3WASMInterface {
  getKSecretSizeMin(): number;

  xxh3(
    data: Uint8Array,
    secret: Uint8Array | null,
    seed: BigInt | null,
    hashLongFunction: XXH3HashLongFunction | null,
  ): BigInt;

  xxh3String(
    data: Uint8Array,
    secret: Uint8Array | null,
    seed: BigInt | null,
    hashLongFunction: XXH3HashLongFunction | null,
  ): string;
}
