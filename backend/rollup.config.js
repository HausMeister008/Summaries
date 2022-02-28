import { nodeResolve } from '@rollup/plugin-node-resolve';
import { dependencies } from './package.json';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/app.ts',
  external: ['pg-native', 'readable-stream'],
  output: {
    sourcemap: true,
    manualChunks: {
      vendor: Object.keys(dependencies),
    },
    dir: 'dist',
    format: 'cjs',
    entryFileNames: '[name].js', // '[name]-[hash].js',
    chunkFileNames: '[name].js' // '[name]-[hash].js'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    json(),
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs({
      ignore: ['pg-native' , './native']
    })
  ]
};