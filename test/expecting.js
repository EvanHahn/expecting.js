/* eslint-disable no-new-wrappers */

var expect = require('../expecting')
var assert = require('assert')

function dummyFunction () {}
var isNameSupported = dummyFunction.name === 'dummyFunction'

describe('expect', function () {
  ['be', 'equal'].forEach(function (be) {
    describe('.to.' + be, function () {
      it('tests `true`', function () {
        expect(true).to[be](true)

        expect(false).not.to[be](true)
        expect(1).not.to[be](true)
        expect('true').not.to[be](true)
        expect(new Boolean(true)).not.to[be](true)

        assert.throws(function () {
          expect('test').to[be](true)
        }, /expected 'test' to equal true/)
      })

      it('tests `false`', function () {
        expect(false).to[be](false)

        expect(true).not.to[be](false)
        expect(1).not.to[be](false)
        expect('false').not.to[be](false)
        expect(new Boolean(false)).not.to[be](false)

        assert.throws(function () {
          expect('test').to[be](false)
        }, /expected 'test' to equal false/)
      })

      it('tests numbers', function () {
        expect(0).to[be](0)
        expect(1).to[be](1)
        expect(+0).to[be](-0)
        expect(+0).to[be](+0)

        expect(1).not.to[be](2)
        expect('1').not.to[be](2)

        assert.throws(function () {
          expect(1).to[be](2)
        }, /expected 1 to equal 2/)
      })

      it('tests objects', function () {
        var a = {}
        var b = {}

        expect(a).to[be](a)

        expect(a).not.to[be](b)
        expect(b).not.to[be](a)

        assert.throws(function () {
          expect({}).to[be]({ hi: 5 })
        }, /expected {} to equal { hi: 5 }/)
      })

      it('tests arrays', function () {
        var a = []
        var b = []

        expect(a).to[be](a)

        expect(a).not.to[be](b)
        expect(b).not.to[be](a)

        assert.throws(function () {
          expect([]).to[be]([1, 2])
        }, /expected \[\] to equal \[ 1, 2 \]/)
      })

      it('tests null', function () {
        expect(null).to[be](null)

        expect('').not.to[be](null)
        expect('null').not.to[be](null)
        expect(undefined).not.to[be](null)
        expect(0).not.to[be](null)
        expect([null]).not.to[be](null)

        assert.throws(function () {
          expect(123).to[be](null)
        }, /expected 123 to equal null/)
      })

      it('tests undefined', function () {
        expect().to[be](void 0)
        expect(void 0).to[be](void 0)

        expect('').not.to[be](void 0)
        expect('undefined').not.to[be](void 0)
        expect('void 0').not.to[be](void 0)
        expect(null).not.to[be](void 0)
        expect(0).not.to[be](void 0)
        expect([void 0]).not.to[be](void 0)

        assert.throws(function () {
          expect(123).to[be](void 0)
        }, /expected 123 to equal undefined/)
      })

      it('tests NaN', function () {
        expect(0 / 0).to[be](0 / 0)
        expect(NaN).to[be](0 / 0)
        expect(0 / 0).to[be](NaN)

        expect(0).not.to[be](NaN)
        expect(0).not.to[be](0 / 0)

        assert.throws(function () {
          expect(123).to[be](0 / 0)
        }, /expected 123 to equal NaN/)
      })
    })
  })

  describe('.to.be.ok', function () {
    it('works on truthy values', function () {
      expect(true).to.be.ok()
      expect(' ').to.be.ok()
      expect(3).to.be.ok()
      expect(/hello/).to.be.ok()
      expect([]).to.be.ok()
      expect({}).to.be.ok()
      expect(new Boolean(true)).to.be.ok()
      expect(new Boolean(false)).to.be.ok()

      assert.throws(function () {
        expect(false).to.be.ok()
      }, /expected false to be truthy/)

      assert.throws(function () {
        expect('').to.be.ok()
      }, /expected '' to be truthy/)
    })

    it('works on falsy values', function () {
      expect(false).not.to.be.ok()
      expect('').not.to.be.ok()
      expect(0).not.to.be.ok()
      expect(0 / 0).not.to.be.ok()
      expect(null).not.to.be.ok()
      expect(void 0).not.to.be.ok()
      expect(NaN).not.to.be.ok()

      assert.throws(function () {
        expect(true).not.to.be.ok()
      }, /expected true to be falsy/)

      assert.throws(function () {
        expect('wow').not.to.be.ok()
      }, /expected 'wow' to be falsy/)
    })
  })

  describe('.to.throw', function () {
    it('should test functions with arguments', function () {
      function itThrowsSometimes (first, second) {
        if (first !== second) {
          throw new Error('tell')
        }
      }

      expect(itThrowsSometimes).withArgs(false, false).to.not.throwException()
      expect(itThrowsSometimes).withArgs(false, true).to.throwException(/tell/)
      expect(itThrowsSometimes).withArgs(true, false).to.throwException(/tell/)
      expect(itThrowsSometimes).withArgs(true, true).to.not.throwException()
    })

    it('should test for exceptions', function () {
      function itThrows () {
        a.b.c  // eslint-disable-line no-undef
      }

      function itThrowsString () {
        throw 'aaa'  // eslint-disable-line no-throw-literal
      }

      function itThrowsMessage () {
        throw new Error('tobi')
      }

      var anonItThrows = function () {
        a.b.c  // eslint-disable-line no-undef
      }

      function itWorks () {
        return
      }

      var anonItWorks = function () {}

      expect(itThrows).to.throwException()
      expect(itWorks).to.not.throwException()

      var subject

      expect(itThrows).to.throwException(function (e) {
        subject = e
      })

      expect(subject).to.be.an(Error)

      expect(itThrowsMessage).to.throwException(/tobi/)
      expect(itThrowsMessage).to.not.throwException(/test/)

      assert.throws(function () {
        expect(itThrowsMessage).to.throwException(/no match/)
      }, /expected 'tobi' to match \/no match\//)

      var subject2

      expect(itThrowsString).to.throwException(function (str) {
        subject2 = str
      })

      expect(subject2).to.be('aaa')

      expect(itThrowsString).to.throwException(/aaa/)
      expect(itThrowsString).to.not.throwException(/bbb/)

      assert.throws(function () {
        expect(itThrowsString).to.throwException(/no match/i)
      }, /expected 'aaa' to match \/no match\/i/)

      var called = false

      expect(itWorks).to.not.throwError(function () {
        called = true
      })

      expect(called).to.be(false)

      var called2 = false

      expect(itWorks).to.not.throw(function () {
        called2 = true
      })

      expect(called2).to.be(false)

      assert.throws(function () {
        expect(5).to.throwException()
      }, /expected 5 to be a function/)

      assert.throws(function () {
        expect(anonItThrows).not.to.throwException()
      }, /expected fn not to throw an exception/)

      assert.throws(function () {
        expect(anonItWorks).to.throwException()
      }, /expected fn to throw an exception/)

      if (isNameSupported) {
        assert.throws(function () {
          expect(itWorks).to.throwException()
        }, /expected itWorks to throw an exception/)
      } else {
        assert.throws(function () {
          expect(itWorks).to.throwException()
        }, /expected fn to throw an exception/)
      }

      if (isNameSupported) {
        assert.throws(function () {
          expect(itThrows).not.to.throwException()
        }, /expected itThrows not to throw an exception/)
      } else {
        assert.throws(function () {
          expect(anonItThrows).not.to.throwException()
        }, /expected fn not to throw an exception/)
      }
    })
  })

  describe('.to.be.a', function () {
    it('tests arrays', function () {
      expect([]).to.be.a('array')
      expect([]).to.be.an('array')
      expect([1, 2, 3]).to.be.an('array')
      expect([undefined]).to.be.an('array')

      expect(null).not.to.be.an('array')
      expect(undefined).not.to.be.an('array')
      expect({}).not.to.be.an('array')
      expect({ length: 0 }).not.to.be.an('array')
      expect({ length: 5 }).not.to.be.an('array')

      assert.throws(function () {
        expect({}).to.be.an('array')
      }, /expected {} to be an array/)
    })

    it('tests regular expressions', function () {
      expect(/a/).to.be.a('regexp')
      expect(/a/).to.be.an('regexp')
      expect(new RegExp('x')).to.be.a('regexp')
      expect(new RegExp('x')).to.be.an('regexp')

      expect('').not.to.be.a('regexp')

      assert.throws(function () {
        expect(null).to.be.a('regexp')
      }, /expected null to be a regexp/)
    })

    it('tests objects', function () {
      expect({}).to.be.an('object')
      expect([]).to.be.an('object')
      expect(new Date()).to.be.an('object')
      expect(new Error()).to.be.an('object')

      expect(0).not.to.be.an('object')
      expect(null).not.to.be.an('object')
      expect(void 0).not.to.be.an('object')

      assert.throws(function () {
        expect(null).to.be.an('object')
      }, /expected null to be an object/)
    })

    it('tests strings', function () {
      expect('').to.be.a('string')
      expect('test').to.be.a('string')
      expect('test').to.be.an('string')
      expect(new String('test')).to.be.a('string')

      assert.throws(function () {
        expect(123).to.be.a('string')
      }, /expected 123 to be a string/)
    })

    it('tests numbers', function () {
      expect(0).to.be.a('number')
      expect(123).to.be.a('number')
      expect(0.123).to.be.a('number')
      expect(-123).to.be.an('number')
      expect(new Number(123)).to.be.a('number')
      expect(1 / 0).to.be.a('number')
      expect(-1 / 0).to.be.a('number')
      expect(0 / 0).to.be.a('number')

      expect('0').not.to.be.a('number')
      expect('1').not.to.be.a('number')

      assert.throws(function () {
        expect(true).to.be.a('number')
      }, /expected true to be a number/)
    })

    it('tests booleans', function () {
      expect(true).to.be.a('boolean')
      expect(false).to.be.a('boolean')
      expect(new Boolean(true)).to.be.a('boolean')
      expect(new Boolean(false)).to.be.a('boolean')

      expect(0).not.to.be.a('boolean')
      expect('true').not.to.be.a('boolean')

      assert.throws(function () {
        expect(123).to.be.a('boolean')
      }, /expected 123 to be a boolean/)
    })

    it('tests Dates', function () {
      expect(new Date()).to.be.a(Date)
      expect(new Date()).to.be.an(Date)

      expect(123).not.to.be.a(Date)

      assert.throws(function () {
        expect(123).to.be.a(Date)
      }, /expected 123 to be an instance of Date/)
    })

    if (typeof Buffer !== 'undefined') {
      it('tests Buffers', function () {
        expect(new Buffer([1, 2, 3])).to.be.a(Buffer)

        expect([1, 2, 3]).not.to.be.a(Buffer)

        assert.throws(function () {
          expect(123).to.be.a(Buffer)
        }, /expected 123 to be an instance of Buffer/)
      })
    }

    it('tests instanceof a new class', function () {
      function Foo () {}
      expect(new Foo()).to.be.a(Foo)
      expect(new Foo()).to.be.an(Foo)

      if (isNameSupported) {
        assert.throws(function () {
          expect(3).to.be.a(Foo)
        }, /expected 3 to be an instance of Foo/)
      } else {
        assert.throws(function () {
          expect(3).to.be.a(Foo)
        }, /expected 3 to be an instance of supplied constructor/)
      }
    })
  })

  describe('.to.be.within', function () {
    it('tests within a range', function () {
      expect(5).to.be.within(3, 6)
      expect(5).to.be.within(3, 5)
      expect(5).to.not.be.within(1, 3)

      assert.throws(function () {
        expect(5).to.not.be.within(4, 6)
      }, /expected 5 to not be within 4..6/)

      assert.throws(function () {
        expect(10).to.be.within(50, 100)
      }, /expected 10 to be within 50..100/)
    })
  })

  ;['above', 'greaterThan'].forEach(function (above) {
    describe('.to.be.' + above, function () {
      it('tests numbers', function () {
        expect(5).to.be[above](2)
        expect(new Number(5)).to.be[above](2)
        expect(5).to.be[above](new Number(2))
        expect(new Number(5)).to.be[above](new Number(2))

        expect(5).to.not.be[above](5)
        expect(5).to.not.be[above](6)

        assert.throws(function () {
          expect(5).to.be[above](6)
        }, /expected 5 to be above 6/)

        assert.throws(function () {
          expect(10).to.not.be[above](6)
        }, /expected 10 to be below 6/)
      })

      it('tests strings', function () {
        expect('hi').to.be[above]('5')

        expect('5').not.to.be[above]('hi')

        assert.throws(function () {
          expect('5').to.be[above]('hi')
        }, /expected '5' to be above 'hi'/)

        assert.throws(function () {
          expect('hi').to.not.be[above]('5')
        }, /expected 'hi' to be below '5'/)
      })
    })
  })

  ;['below', 'lessThan'].forEach(function (below) {
    describe('.to.be.' + below, function () {
      it('tests numbers', function () {
        expect(2).to.be[below](5)
        expect(new Number(2)).to.be[below](5)
        expect(2).to.be[below](new Number(5))
        expect(new Number(2)).to.be[below](new Number(5))

        expect(6).to.not.be[below](5)
        expect(6).to.not.be[below](6)

        assert.throws(function () {
          expect(6).to.be[below](5)
        }, /expected 6 to be below 5/)

        assert.throws(function () {
          expect(6).to.not.be[below](10)
        }, /expected 6 to be above 10/)
      })

      it('tests strings', function () {
        expect('5').to.be[below]('hi')

        expect('hi').not.to.be[below]('5')

        assert.throws(function () {
          expect('hi').to.be[below]('5')
        }, /expected 'hi' to be below '5'/)

        assert.throws(function () {
          expect('5').to.not.be[below]('hi')
        }, /expected '5' to be above 'hi'/)
      })
    })
  })

  ;['atLeast', 'greaterThanOrEqualTo'].forEach(function (atLeast) {
    describe('.to.be.' + atLeast, function () {
      it('tests numbers', function () {
        expect(5).to.be[atLeast](5)
        expect(5).to.be[atLeast](2)
        expect(new Number(5)).to.be[atLeast](2)
        expect(5).to.be[atLeast](new Number(2))
        expect(new Number(5)).to.be[atLeast](new Number(2))

        expect(5).not.to.be[atLeast](10)

        assert.throws(function () {
          expect(5).to.be[atLeast](6)
        }, /expected 5 to be greater than or equal to 6/)

        assert.throws(function () {
          expect(10).to.not.be[atLeast](6)
        }, /expected 10 to be below 6/)
      })
    })
  })

  describe('.to.be.lessThanOrEqualTo', function () {
    it('tests numbers', function () {
      expect(5).to.be.lessThanOrEqualTo(5)
      expect(5).to.be.lessThanOrEqualTo(10)
      expect(new Number(5)).to.be.lessThanOrEqualTo(10)
      expect(5).to.be.lessThanOrEqualTo(new Number(10))
      expect(new Number(5)).to.be.lessThanOrEqualTo(new Number(10))

      expect(5).not.to.be.lessThanOrEqualTo(3)

      assert.throws(function () {
        expect(5).to.be.lessThanOrEqualTo(3)
      }, /expected 5 to be less than or equal to 3/)

      assert.throws(function () {
        expect(6).to.not.be.lessThanOrEqualTo(10)
      }, /expected 6 to be above 10/)
    })
  })

  describe('.to.match', function () {
    it('tests regular expressions', function () {
      expect('foobar').to.match(/^foo/)
      expect('foobar').to.not.match(/^bar/)
      expect('foobar').to.match(new RegExp('^foo'))

      assert.throws(function () {
        expect('foobar').to.match(/^bar/i)
      }, /expected 'foobar' to match \/\^bar\/i/)

      assert.throws(function () {
        expect('foobar').to.not.match(/^foo/i)
      }, /expected 'foobar' not to match \/\^foo\/i/)
    })
  })

  describe('.to.have.length', function () {
    it('tests length for values with lengths', function () {
      expect('test').to.have.length(4)
      expect([1, 2, 3]).to.have.length(3)
      expect({ length: 10 }).to.have.length(10)

      expect('test').to.not.have.length(3)

      assert.throws(function () {
        expect('asd').to.not.have.length(3)
      }, /expected 'asd' to not have a length of 3/)
    })

    it('throws for values with no lengths', function () {
      assert.throws(function () {
        expect(undefined).to.have.length(3)
      }, /expected undefined to have property 'length'/)

      assert.throws(function () {
        expect(null).to.have.length(3)
      }, /expected null to have property 'length'/)

      assert.throws(function () {
        expect(4).to.have.length(3)
      }, /expected 4 to have property 'length'/)

      assert.throws(function () {
        expect({}).to.have.length(3)
      }, /expected {} to have property 'length'/)
    })
  })

  describe('.to.be.eql', function () {
    it('works for strictly equal values', function () {
      expect('test').to.eql('test')
      expect(123).to.eql(123)

      expect(123).not.to.eql(456)

      assert.throws(function () {
        expect(12).to.eql(69)
      }, /expected 12 to loosely equal 69/)

      assert.throws(function () {
        expect(69).not.to.eql(69)
      }, /expected 69 not to loosely equal 69/)
    })

    it('works for NaN', function () {
      expect(NaN).to.eql(NaN)

      expect(NaN).not.to.eql(19)
      expect(19).not.to.eql(NaN)

      assert.throws(function () {
        expect(NaN).to.eql(69)
      }, /expected NaN to loosely equal 69/)

      assert.throws(function () {
        expect(NaN).not.to.eql(NaN)
      }, /expected NaN not to loosely equal NaN/)
    })

    it('works for loosely equal values', function () {
      expect(void 0).to.eql(null)
      expect(null).to.eql(void 0)
      expect(0).to.eql(false)
      expect('').to.eql(false)
      expect('0').to.eql(0)
      expect(new Number(69)).to.eql(69)
      expect(new Number(69)).to.eql(new Number(69))

      expect('0').not.to.eql(2)

      assert.throws(function () {
        expect(void 0).to.eql(true)
      }, /expected undefined to loosely equal true/)

      assert.throws(function () {
        expect(void 0).not.to.eql(null)
      }, /expected undefined not to loosely equal null/)
    })

    it('works for arrays', function () {
      var a = []

      expect(a).to.eql(a)
      expect([]).to.eql([])
      expect([1, 2]).to.eql([1, 2])
      expect([[1, 2], 3]).to.eql([[1, 2], 3])
      expect([{ hi: 5 }]).to.eql([{ hi: 5 }])

      expect([]).not.to.eql([1, 2])
      expect({}).not.to.eql([1, 2])
      expect([[]]).not.to.eql([1, 2])

      assert.throws(function () {
        expect([1, 2]).to.eql([])
      }, /expected \[ 1, 2 \] to loosely equal \[\]/)

      assert.throws(function () {
        expect([]).not.to.eql([])
      }, /expected \[\] not to loosely equal \[\]/)
    })

    it('works for objects', function () {
      var a = {}

      expect(a).to.eql(a)
      expect({}).to.eql({})
      expect({ hi: 5 }).to.eql({ hi: 5 })
      expect({ hi: { five: 'yas' } }).to.eql({ hi: { five: 'yas' } })

      expect({}).not.to.eql({ hi: 5 })
      expect({}).not.to.eql([1, 2])

      assert.throws(function () {
        expect({ hi: 5 }).to.eql({})
      }, /expected { hi: 5 } to loosely equal {}/)

      assert.throws(function () {
        expect({}).not.to.eql({})
      }, /expected {} not to loosely equal {}/)
    })

    if (typeof Set !== 'undefined') {
      it('works for Sets', function () {
        var a = new Set()

        expect(a).to.eql(a)
        expect(new Set()).to.eql(new Set())
        expect(new Set([1, 2, 3])).to.eql(new Set([1, 2, 3]))

        expect(new Set()).not.to.eql(new Set([1, 2, 3]))

        assert.throws(function () {
          expect(new Set([1])).to.eql(new Set())
        }, /expected Set { 1 } to loosely equal Set {}/)
      })
    }
  })

  describe('.to.be.empty', function () {
    it('tests for emptiness', function () {
      expect('').to.be.empty()
      expect(new String('')).to.be.empty()
      expect({}).to.be.empty()
      expect([]).to.be.empty()

      expect('wow').not.to.be.empty()
      expect(new String('wow')).not.to.be.empty()
      expect([1, 2]).not.to.be.empty()
      expect({ length: 0 }).not.to.be.empty()

      assert.throws(function () {
        expect(null).to.be.empty()
      }, /cannot determine emptiness of null/)

      assert.throws(function () {
        expect(null).not.to.be.empty()
      }, /cannot determine emptiness of null/)

      assert.throws(function () {
        expect(undefined).to.be.empty()
      }, /cannot determine emptiness of undefined/)

      assert.throws(function () {
        expect(123).to.be.empty()
      }, /cannot determine emptiness of 123/)

      assert.throws(function () {
        expect({ a: 'b' }).to.be.empty()
      }, /expected { a: 'b' } to be empty/)

      assert.throws(function () {
        expect({ length: '0' }).to.be.empty()
      }, /expected { length: '0' } to be empty/)

      assert.throws(function () {
        expect('asd').to.be.empty()
      }, /expected 'asd' to be empty/)

      assert.throws(function () {
        expect('').to.not.be.empty()
      }, /expected '' to not be empty/)

      assert.throws(function () {
        expect({}).to.not.be.empty()
      }, /expected {} to not be empty/)
    })
  })

  describe('.to.have.property', function () {
    it('tests for property existence', function () {
      expect('test').to.have.property('length')
      expect(4).to.not.have.property('length')
      expect({ length: undefined }).to.have.property('length')
      expect(5).to.have.property('valueOf')

      expect(undefined).not.to.have.property('foo')
      expect(null).not.to.have.property('foo')
      expect(123).not.to.have.property('foo')
      expect({}).not.to.have.property('foo')

      assert.throws(function () {
        expect(undefined).to.have.property('foo')
      }, /expected undefined to have property 'foo'/)

      assert.throws(function () {
        expect('asd').to.have.property('foo')
      }, /expected 'asd' to have property 'foo'/)

      assert.throws(function () {
        expect({ length: undefined }).to.not.have.property('length')
      }, /expected { length: undefined } not to have property 'length'/)
    })

    it('tests for property value', function () {
      expect('test').to.have.property('length', 4)
      expect({ length: undefined }).to.have.property('length', undefined)

      assert.throws(function () {
        expect('asd').to.have.property('length', 4)
      }, /expected 'asd' to have property 'length' of 4, but got 3/)

      assert.throws(function () {
        expect('asd').to.have.property('foo', 3)
      }, /expected 'asd' to have property 'foo' of 3, but got undefined/)

      assert.throws(function () {
        expect({ length: undefined }).to.not.have.property('length', undefined)
      }, /expected { length: undefined } not to have property 'length' of undefined/)
    })

    it('tests for own property existence', function () {
      function Foo () {
        this.baz = '456'
      }
      Foo.prototype.boo = 123

      expect('test').to.have.own.property('length')
      expect({ length: 12 }).to.have.own.property('length')
      expect(new Foo()).to.have.own.property('baz')

      expect(5).not.to.have.own.property('foo')
      expect(new Foo()).not.to.have.own.property('boo')

      assert.throws(function () {
        expect({ length: 12 }).to.not.have.own.property('length')
      }, /expected { length: 12 } not to have own property 'length'/)
    })

    it('tests for own property value', function () {
      function Foo () {
        this.baz = '456'
      }
      Foo.prototype.boo = 123

      expect('test').to.have.own.property('length', 4)
      expect({ length: 12 }).to.have.own.property('length', 12)
      expect(new Foo()).to.have.own.property('baz', '456')

      var f = new Foo()
      f.boo = 999
      expect(f).to.have.own.property('boo', 999)

      expect(5).not.to.have.own.property('foo', 3)
      expect('test').not.to.have.own.property('length', 3)
      expect({ length: 12 }).not.to.have.own.property('length', 9)
      expect(new Foo()).not.to.have.own.property('boo', 123)
      expect(new Foo()).not.to.have.own.property('boo', 456)

      assert.throws(function () {
        expect({}).to.have.own.property('foo', 10)
      }, /expected {} to have own property 'foo' of 10, but got undefined/)

      assert.throws(function () {
        expect({ foo: 12 }).to.have.own.property('foo', 10)
      }, /expected { foo: 12 } to have own property 'foo' of 10, but got 12/)

      assert.throws(function () {
        expect({ length: 12 }).to.have.own.property('foo', 10)
      }, /expected { length: 12 } to have own property 'foo' of 10, but got undefined/)
    })
  })

  describe('.to.contain', function () {
    it('tests substrings', function () {
      expect('foobar').to.contain('bar')
      expect('foobar').to.contain('foo')
      expect(new String('foobar')).to.contain('foo')
      expect('foobar').to.contain(new String('foo'))
      expect(new String('foobar')).to.contain(new String('foo'))

      expect('foobar').to.not.contain('baz')

      assert.throws(function () {
        expect(3).to.contain('baz')
      }, /expected 3 to contain 'baz'/)

      assert.throws(function () {
        expect('foobar').to.contain('baz')
      }, /expected 'foobar' to contain 'baz'/)

      assert.throws(function () {
        expect('foobar').to.not.contain('bar')
      }, /expected 'foobar' to not contain 'bar'/)
    })

    it('tests arrays', function () {
      expect(['foo', 'bar']).to.contain('foo')
      expect(['foo', 'bar']).to.contain('foo')
      expect(['foo', 'bar']).to.contain('bar')
      expect([1, 2]).to.contain(1)

      expect([]).to.not.contain(1)
      expect(['foo', 'bar']).to.not.contain('baz')
      expect(['foo', 'bar']).to.not.contain(1)

      assert.throws(function () {
        expect(['foo']).to.contain('bar')
      }, /expected \[ 'foo' \] to contain 'bar'/)

      assert.throws(function () {
        expect(['bar', 'foo']).to.not.contain('foo')
      }, /expected \[ 'bar', 'foo' \] to not contain 'foo'/)
    })
  })

  describe('.to.include.string', function () {
    it('tests substrings', function () {
      expect('foobar').to.contain('bar')
      expect('foobar').to.contain('foo')
      expect(new String('foobar')).to.contain('foo')
      expect('foobar').to.contain(new String('foo'))
      expect(new String('foobar')).to.contain(new String('foo'))

      expect('foobar').to.not.contain('baz')

      assert.throws(function () {
        expect(3).to.contain('baz')
      }, /expected 3 to contain 'baz'/)

      assert.throws(function () {
        expect('foobar').to.contain('baz')
      }, /expected 'foobar' to contain 'baz'/)

      assert.throws(function () {
        expect('foobar').to.not.contain('bar')
      }, /expected 'foobar' to not contain 'bar'/)
    })
  })

  describe('.to.have.keys', function () {
    it('should test keys(array)', function () {
      expect({ foo: 1 }).to.have.keys(['foo'])
      expect({ foo: 1, bar: 2 }).to.have.keys(['foo', 'bar'])
      expect({ foo: 1, bar: 2 }).to.have.keys('foo', 'bar')
      expect({ foo: 1, bar: 2, baz: 3 }).to.include.keys('foo', 'bar')
      expect({ foo: 1, bar: 2, baz: 3 }).to.include.keys('bar', 'foo')
      expect({ foo: 1, bar: 2, baz: 3 }).to.include.keys('baz')

      expect({ foo: 1, bar: 2 }).to.include.keys('foo')
      expect({ foo: 1, bar: 2 }).to.include.keys('bar', 'foo')
      expect({ foo: 1, bar: 2 }).to.include.keys(['foo'])
      expect({ foo: 1, bar: 2 }).to.include.keys(['bar'])
      expect({ foo: 1, bar: 2 }).to.include.keys(['bar', 'foo'])

      expect({ foo: 1, bar: 2 }).to.not.have.keys('baz')
      expect({ foo: 1, bar: 2 }).to.not.have.keys('foo', 'baz')
      expect({ foo: 1, bar: 2 }).to.not.include.keys('baz')
      expect({ foo: 1, bar: 2 }).to.not.include.keys('foo', 'baz')
      expect({ foo: 1, bar: 2 }).to.not.include.keys('baz', 'foo')

      assert.throws(function () {
        expect({ foo: 1 }).to.have.keys()
      }, /keys required/)

      assert.throws(function () {
        expect({ foo: 1 }).to.have.keys([])
      }, /keys required/)

      assert.throws(function () {
        expect({ foo: 1 }).to.not.have.keys([])
      }, /keys required/)

      assert.throws(function () {
        expect({ foo: 1 }).to.include.keys([])
      }, /keys required/)

      assert.throws(function () {
        expect({ foo: 1 }).to.have.keys(['bar'])
      }, /expected { foo: 1 } to include key 'bar'/)

      assert.throws(function () {
        expect({ foo: 1 }).to.have.keys(['bar', 'baz'])
      }, /expected { foo: 1 } to include keys 'bar', and 'baz'/)

      assert.throws(function () {
        expect({ foo: 1 }).to.have.keys(['foo', 'bar', 'baz'])
      }, /expected { foo: 1 } to include keys 'foo', 'bar', and 'baz'/)

      assert.throws(function () {
        expect({ foo: 1 }).to.not.have.keys(['foo'])
      }, /expected { foo: 1 } to not include key 'foo'/)

      assert.throws(function () {
        expect({ foo: 1 }).to.not.have.keys(['foo'])
      }, /expected { foo: 1 } to not include key 'foo'/)

      assert.throws(function () {
        expect({ foo: 1, bar: 2 }).to.not.have.keys(['foo', 'bar'])
      }, /expected { foo: 1, bar: 2 } to not include keys 'foo', and 'bar'/)

      assert.throws(function () {
        expect({ foo: 1 }).to.not.include.keys(['foo'])
      }, /expected { foo: 1 } to not include key 'foo'/)

      assert.throws(function () {
        expect({ foo: 1 }).to.include.keys('foo', 'bar')
      }, /expected { foo: 1 } to include keys 'foo', and 'bar'/)

      // only
      expect({ foo: 1, bar: 1 }).to.only.have.keys('foo', 'bar')
      expect({ foo: 1, bar: 1 }).to.only.have.keys(['foo', 'bar'])

      assert.throws(function () {
        expect({ a: 'b', c: 'd' }).to.only.have.keys('a', 'b', 'c')
      }, /expected { a: 'b', c: 'd' } to only have keys 'a', 'b', and 'c'/)

      assert.throws(function () {
        expect({ a: 'b', c: 'd' }).to.only.have.keys('a')
      }, /expected { a: 'b', c: 'd' } to only have key 'a'/)
    })
  })

  describe('.fail', function () {
    it('throws an error', function () {
      assert.throws(function () {
        expect().fail()
      }, /explicit failure/)
    })

    it('can throw a custom message', function () {
      assert.throws(function () {
        expect().fail('explicit failure with message')
      }, /explicit failure with message/)
    })
  })

  describe('chaining', function () {
    it('allows chaining with `and`', function () {
      expect(5).to.be.a('number').and.be(5)
      expect(5).to.be.a('number').and.not.be(6)
      expect(5).to.be.a('number').and.not.be(6).and.not.be('5')

      assert.throws(function () {
        expect(5).to.be.a('number').and.not.be(5)
      }, /expected 5 to not equal 5/)

      assert.throws(function () {
        expect(5).to.be.a('number').and.not.be(6).and.not.be.above(4)
      }, /expected 5 to be below 4/)
    })
  })
})
