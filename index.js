const acorn = require('acorn');
const JSPath = require("JSPath");
const escodegen = require('escodegen');

const ast = acorn.parse(`
  var foo = 2;
  function gig() { var f = 2 + 3; };
  var bar = 2 + 2;
`);


// wraps JSPath.apply, extracting the single matching value
const matchOnce = (pattern, ast) => {
  const match = JSPath.apply(pattern, ast);
  if (match.length > 1) {
    console.error(pattern, 'matched more than one element');
  }
  return match.length > 0 ? match[0] : undefined;
}

const pathRule = (path, ifMatch) =>
  (ast, runner) => {
    const match = matchOnce(path, ast);
    return match ? ifMatch(match, runner): '';
  }

const identity = (ast, runner) => {
  var out = {}
  for (var prop in ast) {
    if (Array.isArray(ast[prop])) {
      out[prop] = ast[prop].map(runner);
    } else if (typeof ast[prop] === "object") {
      out[prop] = runner(ast[prop]);
    } else {
      out[prop] = ast[prop];
    }
  }
  return out;
}

const computeExpressionRule = pathRule(
  '.{.type === "BinaryExpression" && .left.type === "Literal" && .right.type === "Literal"}',
  (ast, runner) => ({
    type: 'Literal',
    value: ast.left.value + ast.right.value
  })
);

const combineVariableDeclarations = pathRule(
  '.{.type === "Program" || .type === "BlockStatement"}',
  (ast, runner) => Object.assign({}, ast, {
      body: [{
        type: 'VariableDeclaration',
        kind: 'var',
        declarations: JSPath.apply('.body{.type === "VariableDeclaration"}.declarations', ast).map(runner)
      }]
      .concat(ast.body.filter(d => d.type !== 'VariableDeclaration')).map()
    })
)

const memberExpressionLiterals = pathRule(
  '.{.type === "MemberExpression" && .computed === false && .property.type === "Identifier"}',
  (ast, runner) =>
    acorn.parse(`${ast.object.name}["${ast.property.name}"]`).body[0].expression
    // Object.assign({}, ast, {
    //   computed: false,
    //   property: {
    //     type: 'Identifier',
    //     name: ast.property.value
    //   }
    // })
);

const rules = [
  computeExpressionRule,
  combineVariableDeclarations,
  memberExpressionLiterals,
  identity
];

const rulesRunner = (ast) => {
  for (var i=0; i< rules.length; i++) {
    var rule = rules[i];
    var res = rule(ast, rulesRunner);
    if (res !== '') {
      return res;
      break;
    }
  }
}

let previous = ast;
let next = rulesRunner(previous);
while(JSON.stringify(next) !== JSON.stringify(previous)) {
  previous = next;
  next = rulesRunner(next);
}

const result = next;
// console.log(JSON.stringify(result, null, 2));
console.log(escodegen.generate(result));
console.log(JSON.stringify(ast, null, 2));
