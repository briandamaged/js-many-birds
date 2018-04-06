
const { expect } = require('chai');

const {
  Fulfiller, ManyBirds,
} = require('../../src/index');




describe('Fulfiller', function() {

  context('there is an unresolved Promise for a specific set of arguments', function() {

    context('given the same set of arguments', function() {

      it('returns the same unresolved Promise', async function() {
        let x = 0;
        const f = Fulfiller(async function() {
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



  context('Promise is resolved', function() {
    it('allows a new Promise to be created', async function() {
      let x = 0;
      const f = Fulfiller(async function() {
        return x++;
      });


      const p1 = f("foo");
      const v1 = await p1;

      const p2 = f("foo");
      const v2 = await p2;

      expect(p1).to.not.equal(p2);
      expect(v1).to.equal(0);

      expect(v2).to.equal(1);
    });
  });


  context('Promise is rejected', function() {
    it('allows a new Promise to be created', async function() {
      let x = 0;
      const f = Fulfiller(async function() {
        throw new Error("" + (x++));
      });



      let catches = 0;

      const p1 = f("foo");
      try {
        await p1;
      } catch(err) {
        expect(err.message).to.equal("0");
        ++catches;
      }


      const p2 = f("foo");
      try {
        await p2;
      } catch(err) {
        expect(err.message).to.equal("1");
        ++catches;
      }

      expect(p1).to.not.equal(p2);

      // Confirm that we visited both catch statements
      expect(catches).to.equal(2);
    });
  });


});
