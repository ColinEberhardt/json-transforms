const transformer = require('./../build/json-transformer');
const identity = transformer.identity;

describe('Identity rule', () => {
  const spy = {
    runner: () => {}
  };

  it('should visit every object property', () => {
    const json = {
      foo: 'bar',
      bar: 23
    };

    spyOn(spy, 'runner');
    identity(json, spy.runner);

    expect(spy.runner).toHaveBeenCalledWith('bar');
    expect(spy.runner).toHaveBeenCalledWith(23);
  });

  it('should visit every array item', () => {
    const json = [45, 'fish'];

    spyOn(spy, 'runner');
    identity(json, spy.runner);

    expect(spy.runner).toHaveBeenCalledWith(45);
    expect(spy.runner).toHaveBeenCalledWith('fish');
  });

  it('should individually visit each item within an array property', () => {
    const json = {
      data: [45, 'fish']
    };

    spyOn(spy, 'runner');
    identity(json, spy.runner);

    expect(spy.runner).toHaveBeenCalledWith(45);
    expect(spy.runner).toHaveBeenCalledWith('fish');
  });

  it('should return the results of the runner for each object property', () => {
    const json = {
      foo: 'bar',
      bar: 23
    };

    spyOn(spy, 'runner').and.callFake(value => {
      return value === 'bar' ? 'moo' : 'cat';
    });
    const result = identity(json, spy.runner);

    expect(result).toEqual({ foo: 'moo', bar: 'cat' });
  });

  it('should visit every array property', () => {
    const json = [
      45, 'fish'
    ];

    spyOn(spy, 'runner').and.callFake(value => {
      return value === 45 ? 'moo' : 'cat';
    });
    const result = identity(json, spy.runner);

    expect(result).toEqual(['moo', 'cat']);
  });
});
