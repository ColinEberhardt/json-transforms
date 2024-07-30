const transform = (json, rules) => {

  const runner = match => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const res = rule(match, adaptedRunner);
      if (res !== null) {
        return res;
      }
    }
    // at this point, not yet returned.
    // the runner function will return "undefined".
  };

  const adaptedRunner = ast => {
    if (Array.isArray(ast)) {
      let result = ast.map(r => runner(r));
      // a call to runner(r) may return "undefined".
      // "undefined" should not appear in the result array.
      // so let's filter it out.
      result = result.filter((e) => {
        return (e !== undefined && e !== null);
      });
      return result;
    } else {
      return runner(ast);
    }
  };

  return adaptedRunner(json);
};

export default transform;
