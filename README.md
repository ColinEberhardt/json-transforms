# JSON Transforms

Provides a recursive, pattern-matching approach to transforming JSON data. Transformations are defined as a set of rules which match the structure of a JSON object. When a match occurs, the rule emits the transformed data, optionally recursing to transform child objects.

This framework makes use of [JSPath](https://github.com/dfilatov/jspath), a domain-specific language for querying JSON objects. It is alse heavily inspired by [XSLT](https://en.wikipedia.org/wiki/XSLT), a language for transforming XML documents.

For more information about this project, see the associated blog post:

http://blog.scottlogic.com/2016/06/22/xslt-inspired-ast-transforms.html

## Usage

The following examples show how to transform this JSON object:

```javascript
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

```javascript
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

```bash
npm install json-transforms --save
```

The following code demonstrates how to perform the transform described above, within a Node environment:

```javascript
const jsont = require('json-transforms');

const json = { ... };

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

The **json-transforms** framework is exposed as a global variable `jsont`. The project also depends on [JSPath](https://github.com/dfilatov/jspath), so both must be included in order to run the above example:

```html
<script src="https://unpkg.com/jspath/lib/jspath.js"></script>
<script src="https://unpkg.com/json-transforms/build/json-transforms.js"></script>
```

With these scripts loaded, the above example will also run in the browser.


### Modern JavaScript

The examples in this documentation all use 'modern' JavaScript syntax (arrow functions, constants, etc ...), however, the npm module is transpiled to ES2015, so if you are in a browser environment that lacks ES2016 support, **json-transforms** will still work just fine:

```javascript
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

## Tutorial

The following tutorial demonstrates the **json-transforms** API through a series of examples. The tutorial will use the following example JSON structure, transforming it into various different forms:

```javascript
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

### Identity transformation

JSON transformation is performed by the `transform` function which takes two arguments, the JSON object being transformed, and an array of rules. The transform function iterates over the list of rules, in the order given, to determine whether any return a value other than `null`, which indicates a match.

For most transformations you will want to make use of the `identity` rule, which iterates over all the properties of an object, recursively invoking the transform function for all properties that are objects or arrays, and simply returns the property values for all others.

If you transform a JSON object via the identity:

```javascript
const rules = [ jsont.identity ];
const transformed  = jsont.transform(json, rules);
```

You get an exact duplicate of the object back again! Useful.

### A simple path rule

The `pathRule` function creates a rule that uses JSPath to match a pattern within the JSON sub-tree passed to the rule. If a match occurs, the associated function is invoked. Here's a quick illustration:

```javascript
const rules = [
  jsont.pathRule(
    '.automobiles', d => ({
      'count': d.match.length
    })
  ),
  jsont.identity
];
```

Which outputs the following when applied to the example JSON:

```javascript
{ count: 5 }
```

This path rule, which has the path `.automobiles` matches any object with an `automobiles` property. If a match occurs, it emits a JSON object with a `count` property. The `match` property of the object passed to this function contains the array of objects that match this path. In this case, it is the array of 5 automobiles, hence `d.match.length` returns 5.

Because of the recursive nature of the identity transform, this rule will match any object with an `automobiles`, regardless of its location within the JSON data.

For example, if the input JSON was changed to the following:

```javascript
const json = {
  'UK' : {
      'automobiles': [
        { 'maker': 'Nissan', 'model': 'Teana', 'year': 2011 },
        { 'maker': 'Honda', 'model': 'Jazz', 'year': 2010 },
      ]
  },
  'USA' : {
      'automobiles': [
        { 'maker': 'Honda', 'model': 'Civic', 'year': 2007 },
        { 'maker': 'Toyota', 'model': 'Yaris', 'year': 2008 },
        { 'maker': 'Honda', 'model': 'Accord', 'year': 2011 }
      ]
  }
};
```

The identity transform would emit `UK` and `USA`, recursively applying rules, to give the following totals:

```javascript
{
  "UK": {
    "count": 2
  },
  "USA": {
    "count": 3
  }
}
```

**NOTE: Rule order matters!** - the current transform iteration stops on the first matching rule. Therefore, if you put the identity rule before the path rule in the current example, the `.automobiles` rule will never be reached!

### JSPath Syntax

For detailed documentation of the JSPath syntax, visit the [project website](https://github.com/dfilatov/jspath). The documentation really is great!

The JSPath syntax is  easy to understand, here are a few quick examples:

 - `.automobiles` - match an object with an automobiles property, returning the value of this property.
 - `.automobiles.year` - match the year of each automobile, this would return an array of years.
 - `..year` - the single-dot syntax matches objects with the given property, the double-dot is a 'deep' match, finding any objects nested within the JSON structure. With **json-transforms** you typically use the identity transform, which avoids the need for deep matching.
 - `.automobiles{.maker === "Honda" && .year > 2009}.model` - find the model of any automobile made by Honda, with a year greater than 2009.

As you can see, JSPath is *very* powerful.

### Match context

The above examples have demonstrated the use of the `match` property, which contains the objects that match the given path. It also has a `context` property, which is the object being matched on. An easy way to see the difference between them is to create a transform that outputs both:

```javascript
const rules = [
  jsont.pathRule(
    '.maker', d => ({
        context: d.context,
        match: d.match
    })
  ),
  jsont.identity
];
```

Which outputs the following:

```javascript
{
  "automobiles": [
    {
      "context": {
        "maker": "Nissan",
        "model": "Teana",
        "year": 2011
      },
      "match": "Nissan"
    },
    ...
}
```

You can see that the `.maker` path matches objects that have the `maker` property, with the match being the value of this property. Whereas the context is the object that was matched.

### Recursive matches

In the current example, the path rule outputs the number of items that match the given path. However, it's also possible to continue matching rules in a recursive fashion.

To see this in action, we'll start with a simple rule that matches objects with a `.maker` property, outputting a formatted description:

```javascript
const rules = [
  jsont.pathRule(
    '.maker', d => ({
      text: `The ${d.context.model} was made in ${d.context.year}`
    })
  ),
  jsont.identity
];
```

Which outputs the following:

```javascript
{
  "automobiles": [
    {
      "text": "Teana was made in 2011"
    },
    {
      "text": "Jazz was made in 2010"
    },
    {
      "text": "Civic was made in 2007"
    },
    {
      "text": "Yaris was made in 2008"
    },
    {
      "text": "Accord was made in 2011"
    }
  ]
}
```

If you just wanted to output the result for Honda automobiles, you could add a new rule with a path that matches Honda cars, then recurse, by invoking the `runner` function:

```javascript
const rules = [
  jsont.pathRule(
    '.automobiles{.maker === "Honda"}', d => ({
      automobiles: d.runner()
    })
  ),
  jsont.pathRule(
    '.maker', d => ({
        text: `The ${d.context.model} was made in ${d.context.year}`
    })
  ),
  jsont.identity
];
```

Which gives the following:

```javascript
{
  "automobiles": [
    {
      "text": "The Jazz was made in 2010"
    },
    {
      "text": "The Civic was made in 2007"
    },
    {
      "text": "The Accord was made in 2011"
    }
  ]
}
```

This is a *very* powerful feature of the framework, allowing you to construct complex transforms that are composed of a number of simpler transformations.
