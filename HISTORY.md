0.1.0 / 2016-01-23
==================

* new: `greaterThanOrEqualTo`/`atLeast`
* new: `lessThanOrEqualTo`
* new: `between` as an alias for `within`

* update: non-array objects with `length` properties are no longer considered empty
* update: change error message when determining emptiness of values that are not strings, arrays, or objects
* update: change error messages for `.to.have.property` and `.to.have.own.property`
* update: change error messages for `.to.eql`

* fix: `.to.have.own.property` now works with the documented second argument
* fix: `expect(NaN).to.be(NaN)` is no longer a failure
* fix: `.to.be.above` and `.to.be.below` have better string support
* fix: object versions of literals (like `new String`) now work better
* fix: `.to.eql` for Set objects

* remove: `expect.version`
* remove: `expect.Assertion`
* remove: `expect.eql`
* remove: `expect.stringify`

This is the first version after the fork. Changes for the previous version are listed below.

---

0.3.0 / 2014-02-20
==================

 * renmaed to `index.js`
 * added repository to package.json
 * remove unused variable and merge
 * simpify isDate() and remove unnecessary semicolon.
 * Add .withArgs() syntax for building scenario
 * eql(): fix wrong order of actual vs. expected.
 * Added formatting for Error objects
 * Add support for 'regexp' type and eql comparison of regular expressions.
 * Better to follow the same coding style
 * Use 'showDiff' flag
 * Add 'actual' & 'expected' property to the thrown error
 * Pass .fail() unit test
 * Ignore 'script*' global leak in chrome
 * Exposed object stringification function
 * Use isRegExp in Assertion::throwException. Fix #25
 * Cleaned up local variables

0.2.0 / 2012-10-19
==================

  * fix isRegExp bug in some edge cases
  * add closure to all assertion messages deferring costly inspects
    until there is actually a failure
  * fix `make test` for recent mochas
  * add inspect() case for DOM elements
  * relax failure msg null check
  * add explicit failure through `expect().fail()`
  * clarified all `empty` functionality in README example
  * added docs for throwException fn/regexp signatures

0.1.2 / 2012-02-04
==================

  * Added regexp matching support for exceptions.
  * Added support for throwException callback.
  * Added `throwError` synonym to `throwException`.
  * Added object support for `.empty`.
  * Fixed `.a('object')` with nulls, and english error in error message.
  * Fix bug `indexOf` (IE). [hokaccha]
  * Fixed object property checking with `undefined` as value. [vovik]

0.1.1 / 2011-12-18
==================

  * Fixed typo

0.1.0 / 2011-12-18
==================

  * Initial import
