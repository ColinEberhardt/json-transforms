const JSPath = require('JSPath');

// wraps JSPath.apply, extracting the single matching value
const matchOnce = (pattern, ast) => {
  const match = JSPath.apply(pattern, ast);
  if (match.length > 1) {
    console.error(pattern, 'matched more than one element');
  }
  return match.length > 0 ? match[0] : undefined;
};

module.exports = (path, ifMatch) =>
  (ast, runner) => {
    const match = matchOnce(path, ast);
    return match ? ifMatch(match, runner) : '';
  };
