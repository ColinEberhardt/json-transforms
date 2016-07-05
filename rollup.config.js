import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  moduleName: 'json_transformer',
  format: 'umd',
  plugins: [ babel() ],
  dest: 'build/json-transformer.js',
  globals: {
    JSPath: 'JSPath'
  }
};
