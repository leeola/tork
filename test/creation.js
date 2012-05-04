#!/usr/bin/env node
//
// test/creation.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed 
//
/*jshint asi: true, laxbreak: true*/
var should = require('should')

// These are here so my IDE will shut the hell up.
var before = global.before
  , beforeEach = global.beforeEach
  , describe = global.describe
  , it = global.it

describe('tork', function () {
  var tork_lib = require('../lib')
  
  it('should return a function', function () {
    tork_lib.should.be.an.instanceof(Function)
  })
  
  describe('#()', function () {
    var tork
    beforeEach(function () {
      tork = tork_lib()
    })
    
    it('should return a tork object instance', function () {
      // To assert it's identity we're just going to make sure
      // some basic tork functions exist.
      should.exist(tork.get)
      should.exist(tork.handle)
    })
    
    it('should be a unique object each execution', function () {
      var new_tork = tork_lib()
      var old_tork = tork
      
      old_tork.foo = 'bar'
      should.not.exist(new_tork.foo)
    })
  })
})