var bind = require('lodash/bind')
var every = require('lodash/every')
var has = require('lodash/has')
var hasIn = require('lodash/hasin')
var i = require('util').inspect
var indexOf = require('lodash/indexof')
var isArray = require('lodash/isarray')
var isEmpty = require('lodash/isempty')
var isEqual = require('lodash/isequal')
var isFunction = require('lodash/isfunction')
var isObject = require('lodash/isobject')
var isRegExp = require('lodash/isregexp')
var isString = require('lodash/isstring')
var isnan = require('lodash/isnan')
var keys = require('lodash/keys')
var map = require('lodash/map')

/**
 * Exports.
 */

module.exports = expect

/**
 * Possible assertion flags.
 */

var flags = {
  not: ['to', 'be', 'have', 'include', 'only'],
  to: ['be', 'have', 'include', 'only', 'not'],
  only: ['have'],
  have: ['own'],
  be: ['an']
}

function expect (obj) {
  return new Assertion(obj)
}

/**
 * Constructor
 *
 * @api private
 */

function Assertion (obj, flag, parent) {
  var i, l
  var self = this

  this.obj = obj
  this.flags = {}

  if (parent !== undefined) {
    this.flags[flag] = true

    for (i in parent.flags) {
      if (parent.flags.hasOwnProperty(i)) {
        this.flags[i] = true
      }
    }
  }

  var $flags = flag ? flags[flag] : keys(flags)

  if ($flags) {
    for (i = 0, l = $flags.length; i < l; i++) {
      // avoid recursion
      if (this.flags[$flags[i]]) continue

      var name = $flags[i]
      var assertion = new Assertion(this.obj, name, this)

      if (isFunction(Assertion.prototype[name])) {
        // clone the function, make sure we dont touch the prot reference
        var old = this[name]
        this[name] = function () {
          return old.apply(self, arguments)
        }

        for (var fn in Assertion.prototype) {
          if (Assertion.prototype.hasOwnProperty(fn) && fn !== name) {
            this[name][fn] = bind(assertion[fn], assertion)
          }
        }
      } else {
        this[name] = assertion
      }
    }
  }
}

/**
 * Performs an assertion
 *
 * @api private
 */

Assertion.prototype.assert = function (truth, okMessage, notMessage, expected) {
  var message = this.flags.not ? notMessage : okMessage
  var ok = this.flags.not ? !truth : truth

  if (!ok) {
    var err = new Error(message.call(this))

    var hasExpected = arguments.length > 3
    if (hasExpected) {
      err.actual = this.obj
      err.expected = expected
      err.showDiff = true
    }

    throw err
  }

  this.and = new Assertion(this.obj)
}

/**
 * Check if the value is truthy
 *
 * @api public
 */

Assertion.prototype.ok = function () {
  this.assert(
    !!this.obj
    , function () { return 'expected ' + i(this.obj) + ' to be truthy' }
    , function () { return 'expected ' + i(this.obj) + ' to be falsy' })
}

/**
 * Creates an anonymous function which calls fn with arguments.
 *
 * @api public
 */

Assertion.prototype.withArgs = function () {
  expect(this.obj).to.be.a('function')

  var fn = this.obj
  var args = Array.prototype.slice.call(arguments)

  return expect(function () {
    fn.apply(null, args)
  })
}

/**
 * Assert that the function throws.
 *
 * @param {Function|RegExp} callback, or regexp to match error string against
 * @api public
 */

Assertion.prototype['throw'] = Assertion.prototype.throwError = Assertion.prototype.throwException = function (fn) {
  expect(this.obj).to.be.a('function')

  var thrown = false
  var not = this.flags.not

  try {
    this.obj()
  } catch (e) {
    if (isRegExp(fn)) {
      var subject = isString(e) ? e : e.message
      if (not) {
        expect(subject).to.not.match(fn)
      } else {
        expect(subject).to.match(fn)
      }
    } else if (isFunction(fn)) {
      fn(e)
    }
    thrown = true
  }

  if (isRegExp(fn) && not) {
    // in the presence of a matcher, ensure the `not` only applies to
    // the matching.
    this.flags.not = false
  }

  var name = this.obj.name || 'fn'
  this.assert(
    thrown,
    function () { return 'expected ' + name + ' to throw an exception' },
    function () { return 'expected ' + name + ' not to throw an exception' }
  )
}

/**
 * Checks if the array is empty.
 *
 * @api public
 */

Assertion.prototype.empty = function () {
  if (isString(this.obj) || isArray(this.obj) || isObject(this.obj)) {
    this.assert(
      isEmpty(this.obj),
      function () { return 'expected ' + i(this.obj) + ' to be empty' },
      function () { return 'expected ' + i(this.obj) + ' to not be empty' }
    )
  } else {
    var message = function () { return 'cannot determine emptiness of ' + i(this.obj) }
    this.assert(this.flags.not, message, message)
  }
  return this
}

/**
 * Checks if the obj exactly equals another.
 *
 * @api public
 */

Assertion.prototype.be = Assertion.prototype.equal = function (obj) {
  var isEqual = obj === this.obj || (isnan(obj) && isnan(this.obj))

  this.assert(
    isEqual,
    function () { return 'expected ' + i(this.obj) + ' to equal ' + i(obj) },
    function () { return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) }
  )
  return this
}

/**
 * Checks if the obj sortof equals another.
 *
 * @api public
 */

Assertion.prototype.eql = function (obj) {
  this.assert(
    eql(this.obj, obj),
    function () { return 'expected ' + i(this.obj) + ' to loosely equal ' + i(obj) },
    function () { return 'expected ' + i(this.obj) + ' not to loosely equal ' + i(obj) },
    obj
  )
  return this
}

/**
 * Assert within start to finish (inclusive).
 *
 * @param {Number} start
 * @param {Number} finish
 * @api public
 */

Assertion.prototype.within = Assertion.prototype.between = function (start, finish) {
  var rangeString = start + '..' + finish
  this.assert(
    this.obj >= start && this.obj <= finish,
    function () { return 'expected ' + i(this.obj) + ' to be within ' + rangeString },
    function () { return 'expected ' + i(this.obj) + ' to not be within ' + rangeString }
  )
  return this
}

/**
 * Assert typeof / instance of
 *
 * @api public
 */

Assertion.prototype.a = Assertion.prototype.an = function (type) {
  if (isString(type)) {
    var n = /^[aeiou]/.test(type) ? 'n' : ''
    var okMessage = function () { return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
    var notMessage = function () { return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type }

    var condition
    if (type === 'object') {
      condition = typeof this.obj === 'object' && this.obj !== null
    } else {
      var expectedType = '[object ' + type + ']'
      var actualType = Object.prototype.toString.call(this.obj).toLowerCase()
      condition = expectedType === actualType
    }

    this.assert(condition, okMessage, notMessage)
  } else {
    // instanceof
    var name = type.name || 'supplied constructor'
    this.assert(
      this.obj instanceof type
      , function () { return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
      , function () { return 'expected ' + i(this.obj) + ' not to be an instance of ' + name })
  }

  return this
}

/**
 * Assert numeric value above _n_.
 *
 * @param {Number} n
 * @api public
 */

Assertion.prototype.greaterThan = Assertion.prototype.above = function (n) {
  this.assert(
    this.obj > n,
    function () { return 'expected ' + i(this.obj) + ' to be above ' + i(n) },
    function () { return 'expected ' + i(this.obj) + ' to be below ' + i(n) }
  )
  return this
}

/**
 * Assert numeric value below _n_.
 *
 * @param {Number} n
 * @api public
 */

Assertion.prototype.lessThan = Assertion.prototype.below = function (n) {
  this.assert(
    this.obj < n,
    function () { return 'expected ' + i(this.obj) + ' to be below ' + i(n) },
    function () { return 'expected ' + i(this.obj) + ' to be above ' + i(n) }
  )
  return this
}

/**
 * Assert numeric value at least _n_.
 *
 * @param {Number} n
 * @api public
 */

Assertion.prototype.greaterThanOrEqualTo = Assertion.prototype.atLeast = function (n) {
  this.assert(
    this.obj >= n,
    function () { return 'expected ' + i(this.obj) + ' to be greater than or equal to ' + i(n) },
    function () { return 'expected ' + i(this.obj) + ' to be below ' + i(n) }
  )
  return this
}

/**
 * Assert numeric value less than or equal to _n_.
 *
 * @param {Number} n
 * @api public
 */

Assertion.prototype.lessThanOrEqualTo = function (n) {
  this.assert(
    this.obj <= n,
    function () { return 'expected ' + i(this.obj) + ' to be less than or equal to ' + i(n) },
    function () { return 'expected ' + i(this.obj) + ' to be above ' + i(n) }
  )
  return this
}

/**
 * Assert numeric value below _n_.
 *
 * @param {Number} n
 * @api public
 */

Assertion.prototype.lessThan = Assertion.prototype.below = function (n) {
  this.assert(
    this.obj < n,
    function () { return 'expected ' + i(this.obj) + ' to be below ' + i(n) },
    function () { return 'expected ' + i(this.obj) + ' to be above ' + i(n) }
  )
  return this
}

/**
 * Assert string value matches _regexp_.
 *
 * @param {RegExp} regexp
 * @api public
 */

Assertion.prototype.match = function (regexp) {
  this.assert(
    regexp.exec(this.obj),
    function () { return 'expected ' + i(this.obj) + ' to match ' + regexp },
    function () { return 'expected ' + i(this.obj) + ' not to match ' + regexp }
  )
  return this
}

/**
 * Assert property "length" exists and has value of _n_.
 *
 * @param {Number} n
 * @api public
 */

Assertion.prototype.length = function (n) {
  expect(this.obj).to.have.property('length')

  var len = this.obj.length
  this.assert(
    n === len,
    function () { return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len },
    function () { return 'expected ' + i(this.obj) + ' to not have a length of ' + len }
  )
  return this
}

/**
 * Assert property _name_ exists, with optional _val_.
 *
 * @param {String} name
 * @param {Mixed} val
 * @api public
 */

Assertion.prototype.property = function (name, val) {
  var condition, message, notMessage

  if (arguments.length === 2) {
    if (this.flags.own) {
      condition = has(this.obj, name) && this.obj[name] === val
      message = function () {
        return 'expected ' + i(this.obj) + ' to have own property ' + i(name) +
          ' of ' + i(val) + ', but got ' + i(this.obj[name])
      }
      notMessage = function () {
        return 'expected ' + i(this.obj) + ' not to have own property ' + i(name) +
          ' of ' + i(val)
      }
    } else {
      condition = hasIn(this.obj, name) && this.obj[name] === val
      message = function () {
        return 'expected ' + i(this.obj) + ' to have property ' + i(name) +
          ' of ' + i(val) + ', but got ' + i(this.obj[name])
      }
      notMessage = function () {
        return 'expected ' + i(this.obj) + ' not to have property ' + i(name) +
          ' of ' + i(this.obj[name])
      }
    }
  } else {
    if (this.flags.own) {
      condition = has(this.obj, name)
      message = function () {
        return 'expected ' + i(this.obj) + ' to have own property ' + i(name)
      }
      notMessage = function () {
        return 'expected ' + i(this.obj) + ' not to have own property ' + i(name)
      }
    } else {
      condition = hasIn(this.obj, name)
      message = function () {
        return 'expected ' + i(this.obj) + ' to have property ' + i(name)
      }
      notMessage = function () {
        return 'expected ' + i(this.obj) + ' not to have property ' + i(name)
      }
    }
  }

  this.assert(condition, message, notMessage)
}

/**
 * Assert that the array contains _obj_ or string contains _obj_.
 *
 * @param {Mixed} obj|string
 * @api public
 */

Assertion.prototype.string = Assertion.prototype.contain = function (obj) {
  var conditional
  if (isString(this.obj)) {
    conditional = ~this.obj.indexOf(obj)
  } else {
    conditional = ~indexOf(this.obj, obj)
  }

  this.assert(
    conditional,
    function () { return 'expected ' + i(this.obj) + ' to contain ' + i(obj) },
    function () { return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) }
  )

  return this
}

/**
 * Assert exact keys or inclusion of keys by using
 * the `.own` modifier.
 *
 * @param {Array|String ...} keys
 * @api public
 */

Assertion.prototype.key = Assertion.prototype.keys = function ($keys) {
  var str
  var ok = true

  $keys = isArray($keys) ? $keys : Array.prototype.slice.call(arguments)

  if (!$keys.length) {
    throw new Error('keys required')
  }

  var actual = keys(this.obj)
  var len = $keys.length

  // Inclusion
  ok = every($keys, function (key) {
    return ~actual.indexOf(key)
  })

  // Strict
  if (!this.flags.not && this.flags.only) {
    ok = ok && $keys.length === actual.length
  }

  // Key string
  if (len > 1) {
    $keys = map($keys, function (key) {
      return i(key)
    })
    var last = $keys.pop()
    str = $keys.join(', ') + ', and ' + last
  } else {
    str = i($keys[0])
  }

  // Form
  str = (len > 1 ? 'keys ' : 'key ') + str

  // Have / include
  str = (!this.flags.only ? 'include ' : 'only have ') + str

  // Assertion
  this.assert(
    ok,
    function () { return 'expected ' + i(this.obj) + ' to ' + str },
    function () { return 'expected ' + i(this.obj) + ' to not ' + str }
  )

  return this
}

/**
 * Assert a failure.
 *
 * @param {String ...} custom message
 * @api public
 */
Assertion.prototype.fail = function (msg) {
  var error = function () { return msg || 'explicit failure' }
  this.assert(false, error, error)
  return this
}

/**
 * Asserts deep equality
 *
 * @see taken from node.js `assert` module (copyright Joyent, MIT license)
 * @api private
 */

function eql (a, b) {
  return a == b || isEqual(a, b)  // eslint-disable-line eqeqeq
}
