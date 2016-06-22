const pathRule = require('./pathRule');

module.exports = (objectName, propertyName, newPropertyName) => pathRule(
  `.{.type === "MemberExpression" && .object.name === "${objectName}" && .property.name === "${propertyName}"}`,
  (ast, runner) => Object.assign({}, ast, {
    property: {
      type: 'Identifier',
      name: newPropertyName
    }
  })
);
