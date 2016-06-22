const pathRule = require('./pathRule');

module.exports = pathRule(
  '.{.type === "MemberExpression" && .computed === false && .property.type === "Identifier"}',
  (ast, runner) =>
    Object.assign({}, ast, {
      computed: true,
      property: {
        type: 'StringLiteral',
        value: ast.property.name
      }
    })
);
