const transform = (json, rules) => {
  const run = ast => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const res = rule(ast, run);
      if (res !== null) {
        return res;
      }
    }
  };

  return run(json);
};

export default transform;
