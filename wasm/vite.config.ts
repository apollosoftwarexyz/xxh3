import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { exec, ExecException } from 'node:child_process';

import { defineConfig, Plugin } from 'vite';

const isExecException = (ex: unknown): ex is ExecException =>
  typeof ex === 'object' && (Object.hasOwn(ex as object, 'stdout') || Object.hasOwn(ex as object, 'stderr'));

async function pluginExec(command: string) {
  // Generate the types in parallel.
  try {
    await promisify(exec)(command);
  } catch (ex) {
    if (isExecException(ex)) {
      console.error('========================================');
      console.error('');
      console.error(ex.stdout);
      console.error('========================================');
    }
    throw ex;
  }
}

function base64Encoder(): Plugin {
  return {
    name: 'base64-encoder',
    async transform(_: any, id: string) {
      /* Source: https://stackoverflow.com/a/78012267 */
      const [path, query] = id.split('?');
      if (query !== 'base64') return null;

      const data = await readFile(path);
      const base64 = data.toString('base64');

      return `export default Buffer.from('${base64}', 'base64');`;
    },
  };
}

function generateTypeDefinitions(): Plugin {
  return {
    name: 'type-definition-generator',
    buildEnd(error?: Error) {
      if (!error) {
        void pluginExec('pnpm tsc --project tsconfig.lib.json');
      }
    },
  };
}

export default defineConfig({
  plugins: [base64Encoder(), generateTypeDefinitions()],
  build: {
    target: 'es2023',
    lib: {
      entry: resolve(import.meta.dirname, 'src/xxh3.ts'),
      formats: ['es'],
    },
  },
});
