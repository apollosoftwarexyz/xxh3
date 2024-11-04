import { expect, describe, test } from 'vitest';
import { xxh3, kSecretSizeMin, xxh3String } from '../src/xxh3';

// Ported from https://github.com/SamJakob/xxh3/blob/master/test/xxh3_test.dart

// Hash results generated with XXH3 from:
// https://github.com/Cyan4973/xxHash

/// The result of hashing 0 bytes.
const kXXH3EmptyHash = 0x2d06800538d394c2n;

/// The result of hashing 1 null byte.
const kXXH3NullHash = 0xc44bdff4074eecdbn;

/// The result of hashing the string "ye".
const kXXH3yeHash = 0xd3a409d78a5fe0d3n;

/// The result of hashing the string "yes".
const kXXH3yesHash = 0xbb9db50d5f73a9dfn;

/// The result of hashing the string "hello".
const kXXH3helloHash = 0x9555e8555c62dcfdn;

/// Not the result of hashing the string "hello".
const kXXH3helloHashInvalid = 0x9555e8555c62dcfen;

/// The result of hashing the string "howdy yall".
const kXXH3howdyyallHash = 0x8ea5ee5c96914d03n;

/// Hash of the following 31-byte string:
/// "Howdy, partners! tree mushrooms"
const kXXH3_31ByteHash = 0x8e9f8eda2faf298dn;

/// Hash of integers from 0 to 130.
const kXXH3_130ByteHash = 0x4d3224b100908a87n;

/// Hash of integers from 0 to 163.
const kXXH3_163ByteHash = 0xaf23aa983bb0b162n;

/// Hash of integers from 0 to 250.
const kXXH3_250ByteHash = 0x3a07e271a5dab0a3n;

/// Hash of integers from 0 to 255, repeated until 2048 elements is reached.
const kXXH3_2048ByteHash = 0xdd420471ff96bd00n;

/// Hash of "Hello, world!" with a custom secret (all null bytes of min secret
/// length).
const kXXH3CustomSecret = 0x7d433b528dca8e34n;

/// Hash of "Hello, world!" with a custom seed and default secret.
const kXXH3CustomSeed = 0x8ec7b6d9d1d4b191n;

/// Hash of "Hello, world!" with a custom seed and a custom secret (all null
/// bytes of min secret length).
const kXXH3CustomSecretAndSeed = 0x8ec7b6d9d1d4b191n;

/// Like [kXXH3CustomSeed] but with a big payload (2048 bytes).
const kXXH3CustomSeedBigPayload = 0x941f28b00d8c4626n;

/// Like [kXXH3CustomSecretAndSeed] but with a big payload (2048 bytes).
const kXXH3CustomSecretAndSeedBigPayload = 0xef152aac651d7cb1n;

function stringBytes(value: string): Uint8Array {
  return Buffer.from(value, 'utf-8');
}

function rangeBytes(max: number) {
  const rangeBytes = new Uint8Array(max);
  for (let i = 0; i < max; i++) {
    rangeBytes[i] = i % 256;
  }
  return rangeBytes;
}

describe('xxh3', () => {
  describe('Test against known hash values', () => {
    test('Hashing 0 bytes', () => {
      expect(xxh3(new Uint8Array(0))).toBe(kXXH3EmptyHash);
    });

    test('Hashing 1 null byte = "\\x00"', () => {
      // Check a string with a null byte.
      expect(xxh3(stringBytes('\x00'))).toBe(kXXH3NullHash);
      // Also check a Uint8List with a null byte.
      // (Bytes are initialized to 0).
      expect(xxh3(new Uint8Array(1))).toBe(kXXH3NullHash);
    });

    test('Hashing 2 bytes = "ye"', () => {
      expect(xxh3(stringBytes('ye'))).toBe(kXXH3yeHash);
    });

    test('Hashing 3 bytes = "yes"', () => {
      expect(xxh3(stringBytes('yes'))).toBe(kXXH3yesHash);
    });

    test('Hashing 5 bytes = "hello"', () => {
      expect(xxh3(stringBytes('hello'))).toBe(kXXH3helloHash);
    });

    test('(Should fail) Hashing 5 bytes = "hello" and checking invalid value', () => {
      expect(xxh3(stringBytes('hello'))).not.toBe(kXXH3helloHashInvalid);
    });

    test('Hashing 10 bytes = "howdy yall"', () => {
      expect(xxh3(stringBytes('howdy yall'))).toBe(kXXH3howdyyallHash);
    });

    test('Hashing 31 bytes = "Howdy, partners! tree mushrooms"', () => {
      expect(xxh3(stringBytes('Howdy, partners! tree mushrooms'))).toBe(kXXH3_31ByteHash);
    });

    test('Hashing 130 bytes = (bytes = 0...130)', () => {
      expect(xxh3(rangeBytes(130))).toBe(kXXH3_130ByteHash);
    });

    test('Hashing 163 bytes = (bytes = 0...130)', () => {
      expect(xxh3(rangeBytes(163))).toBe(kXXH3_163ByteHash);
    });

    test('Hashing 250 bytes = (bytes = 0...250)', () => {
      expect(xxh3(rangeBytes(250))).toBe(kXXH3_250ByteHash);
    });

    test('Hashing 2048 bytes = (bytes = 0...255 - repeated)', () => {
      expect(xxh3(rangeBytes(2048))).toBe(kXXH3_2048ByteHash);
    });

    test('Using an invalid secret (too short) throws an error', () => {
      expect(() => xxh3(stringBytes('Hello, world!'), { secret: new Uint8Array(3) })).toThrowError(
        `xxh3: ArgumentError: secret must be at least ${kSecretSizeMin} byte(s)`,
      );
    });

    test('Using an valid secret does not throw an error (and yields correct hash)', () => {
      // This secret is all zeroes. NEVER do this. See xxh3 documentation for
      // details.
      const secret = new Uint8Array(kSecretSizeMin);
      expect(xxh3(stringBytes('Hello, world!'), { secret: secret })).toBe(kXXH3CustomSecret);
    });

    test('Using a custom seed yields correct hash', () => {
      expect(xxh3(stringBytes('Hello, world!'), { seed: 0x702 })).toBe(kXXH3CustomSeed);
    });

    test('Using a custom seed with custom secret yields correct hash', () => {
      // This secret is all zeroes. NEVER do this. See xxh3 documentation for
      // details.
      const secret = new Uint8Array(kSecretSizeMin);
      expect(xxh3(stringBytes('Hello, world!'), { secret: secret, seed: 0x702 })).toBe(kXXH3CustomSecretAndSeed);
    });

    test('Using a custom seed (with a big payload) yields correct hash', () => {
      expect(xxh3(rangeBytes(2048), { seed: 0x702 })).toBe(kXXH3CustomSeedBigPayload);
    });

    test('Using a custom seed with custom secret (with a big payload) yields correct hash', () => {
      // This secret is all zeroes. NEVER do this. See xxh3 documentation for
      // details.
      const secret = new Uint8Array(kSecretSizeMin);
      expect(xxh3(rangeBytes(2048), { secret: secret, seed: 0x702 })).toBe(kXXH3CustomSecretAndSeedBigPayload);
    });

    test('Passing null or undefined input yields an exception', () => {
      expect(() => xxh3(undefined as never)).toThrowError('xxh3: input must not be null or undefined');
    });
  });

  describe('xxh3String', () => {
    test('Using xxh3String with an empty value produces the expected unsigned 64-bit hex value', () => {
      expect(xxh3String(stringBytes(''))).toBe('2d06800538d394c2');
    });

    test('Using xxh3String with a non-empty produces an expected unsigned 64-bit hex value', () => {
      expect(xxh3String(stringBytes('Hello, world!'))).toBe('f3c34bf11915e869');
    });

    test('Passing null or undefined input yields an exception', () => {
      expect(() => xxh3String(undefined as never)).toThrowError('xxh3String: input must not be null or undefined');
    });
  });
});
