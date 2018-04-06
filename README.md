# many-birds #

Kill many (figurative) birds with one (literal) return value.


## Purpose ##

Let's imagine that we've written an application that needs to serve thousands of requests per second.  Additionally, this application needs to retrieve mostly-static data from an external service.  At any given moment, it is probably making 50 calls to this external service using exactly the same input arguments.  For ex:

```javascript
// The application is currently waiting for 50 occurrences of this Promise to resolve.
const data = await externalService.getData("foo", "bar");
```

Since the data returned by this external service is mostly-static, it means that all 50 Promises will most likely resolve to exactly the same value.  Therefore, we really don't need to make 50 separate calls to the service.  Instead, we really only need to make 1 call to the service; afterwards, this one response can be used to resolve all 50 Promises.

In short: we can kill many (figurative) birds with one (literal) return value.

## Installation ##

```shell
npm install many-birds
```

## Usage ##

```javascript
const { Fulfiller } = require('many-birds');

let x = 0;
const getToken = Fulfiller(async function() {
  return x++;
});



async function run() {
  const tokens1 = await Promise.all([
    getToken(), getToken(), getToken("foo"), getToken("bar"), getToken("foo"),
  ]);

  console.log(tokens1); // Prints: [0, 0, 1, 2, 1]

  const tokens2 = await Promise.all([
    getToken(), getToken("foo"), getToken("foo", "bar"), getToken("foo"),
  ]);

  console.log(tokens2); // Prints: [3, 4, 5, 4]
}


run();

```

Or, if you're using decorators:

```
const { ManyBirds } = require('many-birds');

let x = 0;

const foo = {
  @ManyBirds()
  getToken() {
    return x++;
  }
}
```


