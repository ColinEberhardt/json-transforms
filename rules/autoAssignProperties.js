const pathRule = require('./pathRule');
const babel = require('babel-core');

const parse = code =>
  babel.transform(code).ast.program.body[0];

module.exports = pathRule(
  '.{.type === "ClassMethod" && .kind === "constructor"}',
  (ast, runner) => Object.assign({}, ast, {
    body: {
      type: 'BlockStatement',
      body: ast.params.map(p => parse(`this.${p.name} = ${p.name}`))
        .concat(ast.body.body.map(runner))
    }
  })
);
