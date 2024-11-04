import 'dart:js_interop';
import 'dart:typed_data';

import 'package:xxh3/xxh3.dart';

@JS('BigInt')
external JSBigInt asJSBigInt(String value);

extension on BigInt {
  JSBigInt toJS() => asJSBigInt(toString());
}

extension on JSBigInt {
  @JS('toString')
  external String asDartString();

  int asDartInt() => BigInt.parse(asDartString(), radix: 10).toInt();
}

extension on JSUint8Array {
  Uint8List toUint8List() {
    final dart = toDart;
    final offset = dart.offsetInBytes;
    return dart.buffer
        .asUint8List()
        .sublist(offset, offset + dart.lengthInBytes);
  }
}

HashLongFunction convertHashLongFunction(JSFunction? hashLongFunction) {
  if (hashLongFunction != null) {
    return (ByteData input, int seed, ByteData secret) =>
        (hashLongFunction.callAsFunction(
          null,
          input.toJS,
          asJSBigInt(BigInt.from(seed).toRadixString(10)),
          secret.toJS,
        ) as JSBigInt)
            .asDartInt();
  }

  return kXXH3HashLongFunction64Bit;
}

BigInt _invokeXXH3(
  JSUint8Array data,
  JSUint8Array? secret,
  JSBigInt? seed,
  JSFunction? hashLongFunction,
) {
  try {
    return BigInt.from(xxh3(
      data.toUint8List(),
      secret: secret?.toUint8List(),
      seed: seed?.asDartInt() ?? 0,
      hashLongFunction: convertHashLongFunction(hashLongFunction),
    )).toUnsigned(64);
  } catch (ex) {
    print(ex);
    rethrow;
  }
}

@JSExport()
class XXH3 {
  @JSExport('getKSecretSizeMin')
  JSNumber getKSecretSizeMin() => kSecretSizeMin.toJS;

  @JSExport('xxh3')
  JSBigInt jsXXH3(
    JSUint8Array data,
    JSUint8Array? secret,
    JSBigInt? seed,
    JSFunction? hashLongFunction,
  ) =>
      _invokeXXH3(data, secret, seed, hashLongFunction).toJS();

  @JSExport('xxh3String')
  JSString jsXXH3String(
    JSUint8Array data,
    JSUint8Array? secret,
    JSBigInt? seed,
    JSFunction? hashLongFunction,
  ) =>
      _invokeXXH3(data, secret, seed, hashLongFunction).toRadixString(16).toJS;
}

@JS('__apollosoftwarexyz_xxh3_interface')
external set xxh3Wrapper(JSObject xxh3);

void main() {
  xxh3Wrapper = createJSInteropWrapper(XXH3());
}
