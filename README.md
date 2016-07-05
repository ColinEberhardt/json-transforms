## JSON Transformer

A recursive, pattern-matching, approach to transforming JSON structures.

## Usage

The following examples show how to transform this JSON:

```
const json = {
  "automobiles": [
    { "maker": "Nissan", "model": "Teana", "year": 2011 },
    { "maker": "Honda", "model": "Jazz", "year": 2010 },
    { "maker": "Honda", "model": "Civic", "year": 2007 },
    { "maker": "Toyota", "model": "Yaris", "year": 2008 },
    { "maker": "Honda", "model": "Accord", "year": 2011 }
  ]
};
```

Into the following structure, which just includes those automobiles made by 'Honda', with the 'maker' property
removed:

```
{
  "Honda": [
    { "model": "Jazz", "year": 2010 },
    { "model": "Civic", "year": 2007 },
    { "model": "Accord", "year": 2011 }
  ]
}
```

### Node

Install via npm:

```
npm install json-transformer --save
```

The following code demonstrates how to perform the transformation described above:

```
const jsont = require('./build/json-transformer');

const json = {...};

const rules = [
  jsont.pathRule(
    '.automobiles{.maker === "Honda"}', d => ({
      Honda: d.runner()
    })
  ),
  jsont.pathRule(
    '.{.maker}', d => ({
      model: d.match.model,
      year: d.match.year
    })
  ),
  jsont.identity
];

const transformed  = jsont.transform(json, rules);
```

### Browser

The json-transformer is exposed as a global variable `jsont`. The project also depends on [JSPath](https://github.com/dfilatov/jspath), so both must be included in order to run the above example:

```
<script src="https://npmcdn.com/jspath/lib/jspath.js"></script>
<script src="https://npmcdn.com/json-transformer/build/json-transformer.js"></script>
```

With these scripts loaded, the above example will also run in the browser.


### Modern JavaScript

The examples on this documentation all use 'modern' JavaScript syntax (arrow functions, constants, etc ...), however, the npm module is transpiled to ES2015, so if you are in a browser environment that lacks ES2016 support, json-transformer will still work just fine:

```
var rules = [
  jsont.pathRule(
    '.automobiles{.maker === "Honda"}', function(d) {
      return { honda: d.runner()}
    }
  ),
  jsont.pathRule(
    '.{.maker}', function(d) {
      return {
        model: d.match.model,
        year: d.match.year
      }
    }
  ),
  jsont.identity
];

var transformed  = jsont.transform(json, rules);
```
