const babel = require('babel-core');
const pathRule = require('./rules/pathRule');
const JSPath = require('JSPath');

const identity = (ast, runner) => {
  var out = {};
  for (var prop in ast) {
    const value = ast[prop];
    if (Array.isArray(value)) {
      out[prop] = value.map(runner);
    } else if (typeof value === 'object' && value !== null) {
      out[prop] = runner(value);
    } else {
      out[prop] = value;
    }
  }
  return out;
};

const renameCallExpression = require('./rules/renameCallExpression');
const removeCallExpression = require('./rules/removeCallExpression');

const rules = [
  require('./rules/autoAssignProperties'),
  renameCallExpression('console', 'warn', 'error'),
  removeCallExpression('console', 'log'),
  require('./rules/computeExpression'),
  require('./rules/combineVariableDeclarations'),
  require('./rules/memberExpressionLiterals'),
  identity
];

const rulesRunner = (ast) => {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const res = rule(ast, rulesRunner);
    if (res !== '') {
      return res;
    }
  }
};

const code = `
var f = 1 + 2;
var g = 19;
var f = bar.foo;

console.log('This should be removed');

class Shape {
  constructor(width, height) {
    console.warn("I've been constructed");
  }
}
`;

const ast = babel.transform(code).ast;
let transformed = rulesRunner(ast);
console.log(babel.transformFromAst(transformed).code);
