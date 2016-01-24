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

      assert.throws(function () {
        expect(true).not.to.be.ok()
      }, /expected true to be falsy/)

      assert.throws(function () {
        expect('wow').not.to.be.ok()
      }, /expected 'wow' to be falsy/)
    })
  })

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

  it('should test within(start, finish)', function () {
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

  it('should test above(n)', function () {
    expect(5).to.be.above(2)
    expect(5).to.be.greaterThan(2)
    expect(5).to.not.be.above(5)
    expect(5).to.not.be.above(6)

    assert.throws(function () {
      expect(5).to.be.above(6)
    }, /expected 5 to be above 6/)

    assert.throws(function () {
      expect(10).to.not.be.above(6)
    }, /expected 10 to be below 6/)
  })

  it('should test match(regexp)', function () {
    expect('foobar').to.match(/^foo/)
    expect('foobar').to.not.match(/^bar/)

    assert.throws(function () {
      expect('foobar').to.match(/^bar/i)
    }, /expected 'foobar' to match \/\^bar\/i/)

    assert.throws(function () {
      expect('foobar').to.not.match(/^foo/i)
    }, /expected 'foobar' not to match \/\^foo\/i/)
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

  it('should test eql(val)', function () {
    expect('test').to.eql('test')
    expect({ foo: 'bar' }).to.eql({ foo: 'bar' })
    expect(1).to.eql(1)
    expect('4').to.eql(4)
    expect(/a/gmi).to.eql(/a/mig)

    assert.throws(function () {
      expect(4).to.eql(3)
    }, /expected 4 to sort of equal 3/)
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

  it('should test string()', function () {
    expect('foobar').to.contain('bar')
    expect('foobar').to.contain('foo')
    expect('foobar').to.include.string('foo')
    expect('foobar').to.not.contain('baz')
    expect('foobar').to.not.include.string('baz')

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

  it('should test contain()', function () {
    expect(['foo', 'bar']).to.contain('foo')
    expect(['foo', 'bar']).to.contain('foo')
    expect(['foo', 'bar']).to.contain('bar')
    expect([1, 2]).to.contain(1)
    expect(['foo', 'bar']).to.not.contain('baz')
    expect(['foo', 'bar']).to.not.contain(1)

    assert.throws(function () {
      expect(['foo']).to.contain('bar')
    }, /expected \[ 'foo' \] to contain 'bar'/)

    assert.throws(function () {
      expect(['bar', 'foo']).to.not.contain('foo')
    }, /expected \[ 'bar', 'foo' \] to not contain 'foo'/)
  })

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

  it('should allow chaining with `and`', function () {
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
})
