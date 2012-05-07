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
  
  describe('#all()', function () {
    var app
    
    beforeEach(function () {
      app = tork_lib()
    })
    
    it('should handle a single callback', function () {
      app.all(function () {})
      should.not.exist(app.stack[0].method)
      should.not.exist(app.stack[0].route)
      app.stack[0].handler.should.be.a('function')
    })
    
    it('should handle a route and a callback', function () {
      app.all('/', function () {})
      // Match the regex route.
      '/'.should.match(app.stack[0].route)
      should.not.exist(app.stack[0].method)
      app.stack[0].handler.should.be.a('function')
    })
    
    it('should properly append the stack', function () {
      app.all('/0', function () {})
      app.all('/1', function () {})
      '/0'.should.match(app.stack[0].route)
      '/1'.should.match(app.stack[1].route)
    })
  })
  
  describe('#get()', function () {
    var app
    
    beforeEach(function () {
      app = tork_lib()
    })
    
    it('should exist', function () {
      should.exist(app.get)
    })
    
    it('should be put in the stack', function () {
      app.get(function () {})
      should.not.exist(app.stack[0].method)
      should.not.exist(app.stack[0].route)
      app.stack[0].handler.should.be.a('function')
    })
  })
  
  describe('#use()', function () {
    var app
    
    beforeEach(function () {
      app = tork_lib()
    })
    
    it('should be put in the stack', function () {
      app.use(function () {})
      should.not.exist(app.stack[0].method)
      should.not.exist(app.stack[0].route)
      app.stack[0].handler.should.be.a('function')
    })
  })
  
  describe('#handle()', function () {
    var app
      , req
    
    beforeEach(function () {
      app = tork_lib()
      req = { 'url': '/', 'method': 'GET' }
    })
    
    it('should call the matching handler', function (done) {
      app.all(function () { done() })
      app.handle(req)
    })
    
    it('should not call non-matching handlers', function () {
      app.get('/foo', function () {
        throw new Error('AssertionError: get:/foo should not be matched')
      })
      app.put('/', function () {
        throw new Error('AssertionError: put:/ should not be matched')
      })
      app.handle(req)
    })
    
    it('should call the first item added, not the last', function (done) {
      app.all(function () { done() })
      app.all(function () {
        throw new Error('AssertionError: Last item called before first item.')
      })
      app.handle(req)
    })
  })
  
  describe('next()', function () {
    var app
      , req
    
    beforeEach(function () {
      app = tork_lib()
      req = { 'url': '/', 'method': 'GET' }
    })
    
    it('should call the next item in the stack that matches', function (done) {
      app.all(function (req, next) { next() })
      app.all(function (req, next) { next() })
      app.all(function (req, next) { done() })
      app.handle(req)
    })
    
    it('should pass given objects to the next callback', function (done) {
      app.all(function (req, next) {
        next('foo')
      })
      app.all(function (req, foo, next) {
        foo.should.equal('foo')
        done()
      })
      app.handle(req)
    })
    
    it('should pass given objects to the next callback, in order',
    function (done) {
      app.all(function (req, next) {
        next('foo')
      })
      app.all(function (req, foo, next) {
        next('bar')
      })
      app.all(function (req, foo, bar, next) {
        next('baz')
      })
      app.all(function (req, foo, bar, baz, next) {
        foo.should.equal('foo')
        bar.should.equal('bar')
        baz.should.equal('baz')
        next.should.be.a('function')
        done()
      })
      app.handle(req)
    })
  })
})