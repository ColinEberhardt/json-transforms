const transformer = require('./../build/json-transforms');
const identity = transformer.identity;
const pathRule = transformer.pathRule;
const transform = transformer.transform;

describe('pathRule', () => {

  it('should allow the json to be transformed in non-tree order', () => {
    // this scenario demonstrates how a path rule can cause the json to
    // be parsed in an order other than the original tree-like structure
    const json = {
      'automobiles': [
        { 'maker': 'Nissan', 'model': 'Teana', 'year': 2011 },
        { 'maker': 'Honda', 'model': 'Jazz', 'year': 2010 },
        { 'maker': 'Honda', 'model': 'Civic', 'year': 2007 },
        { 'maker': 'Toyota', 'model': 'Yaris', 'year': 2008 },
        { 'maker': 'Honda', 'model': 'Accord', 'year': 2011 }
      ]
    };

    const groupBy = (arr, fn) =>
      arr.reduce((p, c) => {
        p[fn(c)] ? p[c.maker].push(c) : p[fn(c)] = [c];
        return p;
      }, {});

    const rules = [
      pathRule(
        '.automobiles', d => d.runner(groupBy(d.match, c => c.maker))
      ),
      pathRule(
        '.{.maker}', d => ({
          model: d.match.model,
          year: d.match.year
        })
      ),
      identity
    ];

    const transformed  = transform(json, rules);

    expect(transformed).toEqual({
      'Nissan': [
        { 'model': 'Teana', 'year': 2011 }
      ],
      'Honda': [
        { 'model': 'Jazz', 'year': 2010 },
        { 'model': 'Civic', 'year': 2007 },
        { 'model': 'Accord', 'year': 2011 }
      ],
      'Toyota': [
        { 'model': 'Yaris', 'year': 2008 }
      ]
    });
  });

  it('should work for the simple case given in the readme', () => {
    const json = {
      'automobiles': [
        { 'maker': 'Nissan', 'model': 'Teana', 'year': 2011 },
        { 'maker': 'Honda', 'model': 'Jazz', 'year': 2010 },
        { 'maker': 'Honda', 'model': 'Civic', 'year': 2007 },
        { 'maker': 'Toyota', 'model': 'Yaris', 'year': 2008 },
        { 'maker': 'Honda', 'model': 'Accord', 'year': 2011 }
      ]
    };

    const rules = [
      pathRule(
        '.automobiles{.maker === "Honda"}',
        d => ({
          honda: d.runner()
        })
      ),
      pathRule(
        '.{.maker}', d => ({
          model: d.match.model,
          year: d.match.year
        })
      ),
      identity
    ];

    const transformed  = transform(json, rules);

    expect(transformed).toEqual({
      'honda': [
        {
          'model': 'Jazz',
          'year': 2010
        },
        {
          'model': 'Civic',
          'year': 2007
        },
        {
          'model': 'Accord',
          'year': 2011
        }
      ]
    });
  });
});
