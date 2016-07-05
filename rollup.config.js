import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  moduleName: 'jsont',
  format: 'umd',
  plugins: [ babel() ],
  dest: 'build/json-transforms.js',
  globals: {
    jspath: 'JSPath'
  }
};
