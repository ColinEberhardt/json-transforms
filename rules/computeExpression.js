const pathRule = require('./pathRule');

module.exports = pathRule(
  '.{.type === "BinaryExpression" && .left.type === "NumericLiteral" && .right.type === "NumericLiteral"}',
  (ast, runner) => ({
    type: 'NumericLiteral',
    value: eval(ast.left.value + ast.operator + ast.right.value)
  })
);
