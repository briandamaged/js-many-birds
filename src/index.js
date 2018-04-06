

function Fulfiller(createPromise, {keyFunc = JSON.stringify} = {}) {
  const unfulfilled = new Map();

  function fulfill() {
    const key = keyFunc(arguments);
    const existingPromise = unfulfilled.get(key);

    if(existingPromise) {
      return existingPromise;
    }

    function resolve(value) {
      unfulfilled.delete(key);
      return value;
    }

    function reject(err) {
      unfulfilled.delete(key);
      throw err;
    }

    const p = createPromise.apply(this, arguments).then(resolve, reject);
    unfulfilled.set(key, p);

    return p;
  }

  return fulfill;
}



function ManyBirds(cfg) {
  function manyBirds(target, name, descriptor) {
    descriptor.value = Fulfiller(descriptor.value, cfg);
  }

  return manyBirds;
}




Object.assign(exports, {
  Fulfiller, ManyBirds,
});
