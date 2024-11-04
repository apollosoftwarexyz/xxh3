import 'dart:convert';

import 'package:xxh3/xxh3.dart';

void main() {
  // Get the string as UTF-8 bytes.
  final helloWorldBytes = utf8.encode("Hello, world!");
  print(helloWorldBytes);

  final String hexDigest = xxh3String(helloWorldBytes);
  print(hexDigest); // f3c34bf11915e869

  print(BigInt.from(xxh3(
    helloWorldBytes,
    secret: null,
    seed: 0,
  )).toUnsigned(64).toRadixString(16));
}
