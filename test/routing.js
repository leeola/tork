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

describe('tork', function () {
  var tork_lib = require('../lib')
  
  describe('#get()', function () {
    var app
      , req
    
    beforeEach(function () {
      app = tork_lib()
      req = { 'url': '/', 'method': 'GET' }
    })
    
    it('should exist', function () {
      should.exist(app.get)
    })
    
    it('should handle a single callback', function () {
      app.get(function () {})
      should.not.exist(app.stack[0].route)
      app.stack[0].method.should.equal('get')
      app.stack[0].handler.should.be.a('function')
    })
    
    it('should handle a route and a callback', function () {
      app.get('/', function () {})
      // Match the regex route.
      '/'.should.match(app.stack[0].route)
      app.stack[0].method.should.equal('get')
      app.stack[0].handler.should.be.a('function')
    })
    
    it('should properly append the stack', function () {
      app.get('/0', function () {})
      app.get('/1', function () {})
      '/0'.should.match(app.stack[0].route)
      '/1'.should.match(app.stack[1].route)
    })
  })
  
  describe('#all()')
  
  describe('#use()')
  
  describe('#handle()')
})