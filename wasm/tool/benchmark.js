import { xxh3 } from '../dist/xxh3.js';

const kBatchSize = 5;
const kDataSize = 64 * 1024;

const bytes = new Uint8Array(kDataSize);

let batchResults = [];
let batchOPSResults = [];

for (let j = 0; j < kBatchSize; j++) {
  console.log(`== Batch ${j + 1} of ${kBatchSize} ==`);

  const N = 5000;
  const start = process.hrtime.bigint();
  for (let i = 0; i < N; i++) {
    xxh3(bytes);
  }
  const end = process.hrtime.bigint();

  const totalNs = end - start;
  const nsPerIteration = Number(totalNs) / N;
  batchOPSResults.push(nsPerIteration);
  const nsPerByte = nsPerIteration / bytes.byteLength;
  batchResults.push(nsPerByte);

  console.log(`  -> ${nsPerByte} ns/byte`);
}

console.log('');
console.log('== Summary ==');

console.log(`Data size: ${kDataSize} bytes`);

console.log('');

const averageNsPerIteration = batchOPSResults.reduce((a, b) => a + b, 0) / kBatchSize;
console.log(`Raw Average: ${averageNsPerIteration} ns/op`);
const averageNsPerByte = batchResults.reduce((a, b) => a + b, 0) / kBatchSize;
console.log(`Raw Average: ${averageNsPerByte} ns/byte`);

console.log('');

const iterationsPerNs = 1 / averageNsPerIteration;
const iterationsPerSecond = iterationsPerNs * 1e9;

const nsPerGB = averageNsPerByte * 1024 * 1024 * 1024; // KiB -> MiB -> GiB
const gigabytesPerNs = 1 / nsPerGB;
const gigabytesPerSecond = gigabytesPerNs * 1e9;

console.log(`Average: ${Math.floor(iterationsPerSecond)} ops/s`);
console.log(`Average: ${gigabytesPerSecond.toFixed(2)} GB/s`);
