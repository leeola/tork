#!/usr/bin/env node
//
// test/utils.js
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

describe('utils', function () {
  var utils = require('../lib/utils')
  
  describe('#format_route_pattern()', function () {
    var frp = utils.format_route_pattern
    
    it('should return a RegExp when given a string', function () {
      var return_value = frp('/')
      return_value.should.be.an.instanceof(RegExp)
    })
    
    it('should return a RegExp when given a RegExp', function () {
      var return_value = frp(/\//)
      return_value.should.be.an.instanceof(RegExp)
    })
    
    describe('/', function () {
      var regex = frp('/')
      
      it('should match /', function () {
        '/'.should.match(regex)
      })
      
      it('should not match /foo', function () {
        '/foo'.should.match(regex)
      })
    })
    
    describe('/*', function () {
      var regex = frp('/*')
    
      it('should match /', function () {
        '/'.should.match(regex)
      })
      
      it('should match /foo', function () {
        '/foo'.should.match(regex)
      })
    })
    
    describe('/*/bar', function () {
      var regex = frp('/*/bar')
      
      it('should match /foo/bar', function () {
        '/foo/bar'.should.match(regex)
      })
      
      it('should not match /foo/bar/baz', function () {
        '/foo/bar/baz'.should.not.match(regex)
      })
    })
    
    // Assure we properly handle the dot character
    describe('/foo.html', function () {
      var regex = frp('/foo.html')
      
      it('should match /foo.html', function () {
        '/foo.html'.should.match(regex)
      })
      
      it('should not match /fooxhtml', function () {
        '/fooxhtml'.should.not.match(regex)
      })
    })
  })
})