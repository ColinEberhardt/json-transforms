import JSPath from 'jspath';

const pathRule = (path, ifMatch) =>
  (json, runner) => {
    const match = JSPath.apply(path, json);
    const unwrappedMatch = match.length === 1 ? match[0] : match;
    const rootMatch = unwrappedMatch === json;

    if (match.length > 0) {
      // add recursion checks around the runner
      const guardedRunner = function(leaf) {
        if ((arguments.length === 0 && rootMatch) ||
          (arguments.length === 1 && json === leaf)) {
          console.warn('Warning: un-bounded recursion detected');
          return {};
        } else {
          return leaf ? runner(leaf) : runner(unwrappedMatch);
        }
      };

      return ifMatch({
        match: unwrappedMatch,
        runner: guardedRunner
      });
    } else {
      return null;
    }
  };

export default pathRule;
