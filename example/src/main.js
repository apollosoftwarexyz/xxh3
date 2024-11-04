import { xxh3String } from '@apollosoftwarexyz/xxh3';

const helloWorldBytes = Buffer.from('Hello, world!', 'utf-8');
console.log(xxh3String(helloWorldBytes)); // f3c34bf11915e869
