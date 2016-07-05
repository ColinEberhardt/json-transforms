const transform = (json, rules) => {

  const runner = match => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const res = rule(match, adaptedRunner);
      if (res !== null) {
        return res;
      }
    }
  };

  const adaptedRunner = ast => {
    if (Array.isArray(ast)) {
      return ast.map(r => runner(r));
    } else {
      return runner(ast);
    }
  };

  return adaptedRunner(json);
};

export default transform;
