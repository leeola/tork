#!/usr/bin/env node
//
// test/routing.js
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

describe('Tork', function () {
  var tork_lib = require('../lib')
  
  describe('#get()', function () {
    var app
      , req
    
    beforeEach(function () {
      app = tork_lib()
      req = { 'url': '/', 'method': 'GET' }
    })
    
    it('should exist', function () {
      should.exist(tork.get)
    })
    
    it('should be called without a pattern', function (done) {
      app.get(function () {
        done()
      })
      app.handle(req)
    })
    
    it('should be called with a matching pattern', function (done) {
      app.get(function () {
        done()
      })
      app.handle(req)
    })
    
    it('should not be matched with an invalid pattern', function () {
      app.get('/foo', function () {
        throw new Error('Invalid pattern matched.')
      })
      app.handle(req)
    })
  })
})