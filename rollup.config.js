import { terser } from "rollup-plugin-terser";

export default [
  {
    input: 'cache.js',
    output: {
      file: 'dist/cache.cjs',
      format: 'cjs',
      exports: 'default',
      plugins: [terser()]
    }
  },
  {
    input: 'cache.js',
    output: {
      file: 'dist/cache.esm.js',
      format: 'esm',
      esModule: true,
      exports: 'named',
      plugins: [terser()]
    }
  },
  {
    input: 'cache.js',
    output: {
      file: 'dist/cache.umd.js',
      format: 'umd',
      sourcemap: 'inline',
      name: 'Cache',
      plugins: [terser()]
    }
  }
];