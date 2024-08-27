const transformer = require('./../build/json-transforms');
const identity = transformer.identity;
const pathRule = transformer.pathRule;
const transform = transformer.transform;

describe('Case of top level array of automobile objects -', () => {
  it('find Honda cars out of top level array', () => {
    const automobiles = [
      { maker: 'Nissan', model: 'Teana', year: 2011 },
      { maker: 'Honda', model: 'Jazz', year: 2010 },
      { maker: 'Honda', model: 'Civic', year: 2007 },
      { maker: 'Toyota', model: 'Yaris', year: 2008 },
      { maker: 'Honda', model: 'Accord', year: 2011 }
    ];
    const rules = [pathRule('.{.maker === "Honda"}', (d) => d.match)];
    const transformed = transform(automobiles, rules);
    expect(transformed).toEqual([
      { maker: 'Honda', model: 'Jazz', year: 2010 },
      { maker: 'Honda', model: 'Civic', year: 2007 },
      { maker: 'Honda', model: 'Accord', year: 2011 }
    ]);

    console.log('---------- topLevelArrayCaseSepec.js ----------');
    console.log(transformed);
  });
});
