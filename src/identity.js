const identity = (json, runner) => {
  if (typeof json !== 'object') {
    return json;
  } else if (Array.isArray(json)) {
    return json.map(d => runner(d));
  } else {
    var out = {};
    for (var prop in json) {
      const value = json[prop];
      if (Array.isArray(value)) {
        out[prop] = value.map(d => runner(d));
      } else {
        out[prop] = runner(value);
      }
    }
    return out;
  }
};

export default identity;
