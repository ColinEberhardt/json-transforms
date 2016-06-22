const pathRule = require('./pathRule');

module.exports = (objectName, propertyName) => pathRule(
  `.{.type === "CallExpression" && .callee.object.name === "${objectName}" && .callee.property.name === "${propertyName}"}`,
  (ast, runner) => undefined
);
