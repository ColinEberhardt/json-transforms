const JSPath = require('jspath');
const pathRule = require('./pathRule');

module.exports = pathRule(
  '.{.type === "Program" || .type === "BlockStatement" && .body.type === "VariableDeclaration"}',
  (ast, runner) => Object.assign({}, ast, {
    body: [{
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: JSPath.apply('.body{.type === "VariableDeclaration"}.declarations', ast).map(runner)
    }]
    .concat(ast.body.filter(d => d.type !== 'VariableDeclaration')).map(runner)
  })
);
