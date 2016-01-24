Expecting.js
============

A minimalistic BDD assertion library. An actively maintained fork of [expect.js](https://github.com/Automattic/expect.js).

In Node, `npm install expecting`, and then use it:

```js
var expect = require('expecting')

expect('foo').to.equal('foo')
expect(5).to.be.a('number')
```

In the browser, grab `dist/expecting.js`, and then use it:

```html
<script src="expecting.js"></script>
<script>
var expect = expecting

expect({ a: 'b' }).to.eql({ a: 'b' })
expect([]).to.be.an('array')
</script>
```

## How to use with [Mocha](https://mochajs.org/)

Here's how to use this library with the Mocha testing library:

```js
var expect = require('expecting')

describe('test suite', function () {
  it('does not break the laws of mathematics', function () {
    expect(1).to.equal(1)
  })
})
```

## API

**ok**: assert whether a value is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

```js
expect(true).to.be.ok()
expect(1).to.be.ok()
expect({}).to.be.ok()

expect(false).to.not.be.ok()
expect(0).to.not.be.ok()
```

**be** (alias: **equal**): assert strict equality with `===`. Also works for `NaN`.

```js
expect(1).to.be(1)
expect('hi').to.be('hi')
expect(NaN).to.be(NaN)

expect('foo').not.to.be('bar')
expect({ hi: 5 }).not.to.be({ hi: 5 })
expect(1).not.to.be(true)
expect('1').to.not.be(1)
```

**eql**: assert loose equality that works with objects. Does a deep comparison if `==` fails.

```js
expect(1).to.eql('1')
expect(undefined).to.eql(null)
expect({ a: 'b' }).to.eql({ a: 'b' })

expect(1).not.to.eql(2)
```

**a** (alias: **an**): assert that a property is of the correct type. Use string for primitives and constructors for more complex objects.

```js
expect(5).to.be.a('number')
expect([]).to.be.an('array')
expect([]).to.be.an('object')
expect({}).to.be.an('object')

expect([]).to.be.an(Array)
expect(new Date()).to.be.a(Date)
expect(new Error()).to.be.an(Error)
```

**match**: assert that a string matches a regular expression.

```js
expect('1.2.3').to.match(/[0-9]+\.[0-9]+\.[0-9]+/)
```

**contain**: assert that an array or string contains a value. Uses `indexOf` under the hood.

```js
expect([1, 2]).to.contain(1)
expect('hello world').to.contain('world')

expect('hello world').not.to.contain('goodbye')
```

**length**: assert that an array (or array-like) has the right length.

```js
expect([]).to.have.length(0)
expect([1, 2, 3]).to.have.length(3)
expect({ length: 5 }).to.have.length(5)
```

**empty**: if given an object, assert that it has no keys. If given an array or string, assert that it is empty. Throws an error if given other types.

```js
expect('').to.be.empty()
expect([]).to.be.empty()
expect({}).to.be.empty()

expect({ my: 'object' }).to.not.be.empty()

expect(null).to.be.empty()  // throws an error
```

**property**: assert that a property is present, and optionally of a given value. Can also assert that the property is not inherited.

```js
expect({ foo: 'boo' }).to.have.property('foo')
expect({ foo: 'boo' }).to.have.property('foo', 'boo')

function Klass() {
  this.ownProperty = 123
}
Klass.prototype.parentProperty = 456
var k = new Klass()

expect(k).to.have.property('ownProperty')
expect(k).to.have.own.property('ownProperty')
expect(k).to.have.property('parentProperty')
expect(k).not.to.have.own.property('parentProperty')
```

**key** (alias: **keys**): assert the presence of a key or keys. Supports the `only` modifier.

```js
expect({ a: 'b' }).to.have.key('a')
expect({ a: 'b', c: 'd' }).to.only.have.keys('a', 'c')
expect({ a: 'b', c: 'd' }).to.only.have.keys(['a', 'c'])
expect({ a: 'b', c: 'd' }).to.not.only.have.key('a')
```

**throw** (aliases: **throwException**, **throwError**): assert that a function throws an error when called. Can optionally take a regular expression or a function to make more assertions about the exception.

```js
function fn (message) {
  throw new Error(message || 'Oh no!')
}

expect(fn).to.throw()
expect(fn).to.throw(/Oh no/)

expect(fn).withArgs('Something bad happened.').to.throw(/Something bad/)

expect(fn).to.throw(function (err) {
  expect(err).to.be.an(Error)
})

expect(function () {}).not.to.throw()
```

**between** (alias: **within**): assert that a number is within a certain range.

```js
expect(1).to.be.between(0, 10)
```

**greaterThan** (alias: **above**): assert that a value is greater than another (uses `>`).

```js
expect(5).to.be.greaterThan(3)
```

**lessThan** (alias: **below**): assert that a value is less than another (uses `<`).

```js
expect(0).to.be.lessThan(3)
```

**greaterThanOrEqualTo** (alias: **atLeast**): assert that a value is greater than or equal to another (uses `>=`).

```js
expect(3).to.be.greaterThanOrEqualTo(0)
expect(5).to.be.greaterThanOrEqualTo(5)
```

**lessThanOrEqualTo**: assert that a value is less than or equal to another (uses `<=`).

```js
expect(0).to.be.lessThanOrEqualTo(3)
expect(3).to.be.lessThanOrEqualTo(3)
```

**fail**: explicitly force failure.

```js
expect().fail()                          // throws an error
expect().fail('Custom failure message')  // throws an error
```
