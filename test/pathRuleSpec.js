const transformer = require('./../build/json-transformer');
const pathRule = transformer.pathRule;

describe('pathRule', () => {

  it('returns null if there is no match', () => {
    const json = {
      foo: 'bar'
    };

    const rule = pathRule('.{.bar}', () => {});
    const result = rule(json);
    expect(result).toBeNull();
  });

  it('invokes ifMatch if the path matches', () => {
    const json = {
      cat: [
        { foo: 1 },
        { foo: 2 }
      ]
    };

    const spy = {
      ifMatch: () => {}
    };
    spyOn(spy, 'ifMatch');

    const rule = pathRule('..{.foo}', spy.ifMatch);
    const result = rule(json, {});

    expect(spy.ifMatch.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
      match: [
        { foo: 1 },
        { foo: 2 }
      ]
    }));
  });

  it('unwraps single element matches', () => {
    const json = {
      foo: 1
    };

    const spy = {
      ifMatch: () => {}
    };
    spyOn(spy, 'ifMatch');

    const rule = pathRule('.{.foo}', spy.ifMatch);
    const result = rule(json, {});

    expect(spy.ifMatch.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
      match: { foo: 1 }
    }));
  });

  it('allow the runner to be invoked with a json object', () => {
    const json = {
      cat: {
        foo: {
          bar: 2
        }
      }
    };

    const spy = {
      runner: () => {}
    };
    spyOn(spy, 'runner');

    const rule = pathRule('..{.foo}', d => d.runner(d.match.foo));
    const result = rule(json, spy.runner);

    expect(spy.runner).toHaveBeenCalledWith({
      bar: 2
    });
  });

  it('allow the runner to be invoked without any argument', () => {
    const json = {
      cat: {
        foo: {
          bar: 2
        }
      }
    };

    const spy = {
      runner: () => {}
    };
    spyOn(spy, 'runner');

    const rule = pathRule('..{.foo}', d => d.runner());
    const result = rule(json, spy.runner);

    expect(spy.runner).toHaveBeenCalledWith({
      foo: {
        bar: 2
      }
    });
  });

  it('warns if recursion detected, and halt the runner, when runner invoked with a json object', () => {
    const json = {
      foo: 1
    };

    const spy = {
      runner: () => {}
    };
    spyOn(spy, 'runner');
    spyOn(console, 'warn');
    const runner = () => {};

    // invoke the runner with the matched json, which is the
    // same as teh json above - hence unbounded recursion
    const rule = pathRule('.{.foo}', d => d.runner(d.match));
    const result = rule(json, spy.runner);

    expect(spy.runner).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('Warning: un-bounded recursion detected');
  });

  it('warns if recursion detected, and halt the runner, when runner invoked without arguments', () => {
    const json = {
      foo: 1
    };

    const spy = {
      runner: () => {}
    };
    spyOn(spy, 'runner');
    spyOn(console, 'warn');
    const runner = () => {};

    // invoke the runner with the matched json, which is the
    // same as teh json above - hence unbounded recursion
    const rule = pathRule('.{.foo}', d => d.runner());
    const result = rule(json, spy.runner);

    expect(spy.runner).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('Warning: un-bounded recursion detected');
  });

});
