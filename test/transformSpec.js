const transformer = require('./../build/json-transformer');
const identity = transformer.identity;
const transform = transformer.transform;

describe('Transform', () => {

  describe('Identity transformation', () => {

    it('should return the same json as the input', () => {
      const json = {
        foo: 'bar',
        bar: {
          cat: 23,
          array: [1, 2, 3, 4]
        }
      };

      const output = transform(json, [identity]);
      expect(output).toEqual(json);
    });

    it('should return the same array-wrapped json as the input', () => {
      const json = [
        1, 2, 3,
        { foo: 'bar' }
      ];

      const output = transform(json, [identity]);
      expect(output).toEqual(json);
    });

  });

  describe('Rule precidence', () => {

    it('should stop rule evaluation on the first match', () => {
      const json = {
        foo: 'bar',
        bar: {
          cat: 23
        }
      };

      // a rule that replaces any object with a key 'cat' with 'fish'
      const rule = (json) => json.cat ? 'fish' : null;

      const output = transform(json, [rule, identity]);
      expect(output).toEqual({
        foo: 'bar',
        bar: 'fish'
      });
    });
  });

});
