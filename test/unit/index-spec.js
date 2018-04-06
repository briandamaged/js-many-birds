
const { expect } = require('chai');

const {
  Fulfiller, ManyBirds,
} = require('../../src/index');


function delay(t = 5) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, t);
  });
}


describe('Fulfiller', function() {

  it('foo', async function() {
    let x = 0;
    const f = Fulfiller(async function() {
      await delay();
      return x++;
    });

    const a = await Promise.all([
      f(), f(), f(),
    ]);

    expect(a).to.deep.equal([0, 0, 0]);


    const b = await Promise.all([
      f(), f(), f(),
    ]);

    expect(b).to.deep.equal([1, 1, 1]);


    const c = await Promise.all([
      f("foo"), f("bar"), f("foo"), f("quuz"), f("bar"), f("foo", "bar"),
    ]);

    expect(c).to.deep.equal([2, 3, 2, 4, 3, 5]);
  });



});
