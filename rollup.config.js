import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import { main, module, dependencies } from './package.json'

export default {
  input: './src/index.js',
  external: [
    ...Object.keys(dependencies),
    'cluster',
    'fs',
    'path',
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    json(),
    babel(),
    commonjs(),
    // uglify({}, minify),
  ],
  output: [
    {
      file: main,
      format: 'cjs',
    }, {
      file: module,
      format: 'es',
    },
  ],
}
