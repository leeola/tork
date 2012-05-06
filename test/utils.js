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
    
    it('should return a RegExp when given a string')
    
    it('should return a RegExp when given a RegExp')
    
    describe('/*', function () {
      var regex = frp('/*')
    
      it('should match /', function () {
        '/'.should.match(regex)
      })
      
      it('should match /foo', function () {
        '/foo'.should.match(regex)
      })
    })
  })
})