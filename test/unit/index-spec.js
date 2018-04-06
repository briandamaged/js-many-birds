
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

  context('there is an unresolved Promise for a specific set of arguments', function() {

    context('given the same set of arguments', function() {

      it('returns the same unresolved Promise', async function() {
        let x = 0;
        const f = Fulfiller(async function() {
          await delay();
          return x++;
        });

        const p = [
          f(),
          f("foo"),
          f("foo", "bar"),
          f("foo"),
          f(),
        ];


        expect(p[0]).to.equal(p[4]);
        expect(p[0]).to.not.equal(p[1]);
        expect(p[0]).to.not.equal(p[2]);

        expect(p[1]).to.equal(p[3]);
        expect(p[1]).to.not.equal(p[2]);

        const r = await Promise.all(p);

        expect(r).to.deep.equal([0, 1, 2, 1, 0]);
      });

    });

  });





});
