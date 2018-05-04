import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-local-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  format: 'cjs',
  plugins: [
    localResolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [['es2015', { modules: false, loose: true }]],
      plugins: [['transform-runtime',{
        "helpers": true,
        "polyfill": false,
        "regenerator": false
      }]],
      runtimeHelpers: true
    })
  ]
};
