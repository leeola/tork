#!/usr/bin/env node
//
// lib/app.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxcomma: true*/
var methods = require('./methods')
  , utils = require('./utils')


// () -> function
//
// Returns:
//  A function which hands off the given request object to `app.handle(req)`
//
// Desc:
//  Create a tork instance.
exports.create = function () {
  /* I'm disabling this functionality until `app.use()` gets implemented.
  function app(req) {
    this.handle(req)
  }
  */
  var app = {}
  
  utils.merge(app, proto)
  app.init()
  return app
}

// The 'prototype' for our app object.
var proto = exports.proto = {}

// () -> undefined
//
// Desc:
//  Initialize the data for this object instance.
proto.init = function () {
  var self = this
  
  // The stack is a collection of objects containing routes to match to
  // in the following format..
  //{
  //    'method': 'get'
  //  , 'route': \foo\
  //  , 'handler': function
  //}
  this.stack = []
  
  // Add additional methods to this object for each 'method' supported.
  for (var i = 0; i < methods.length; i++) {
    var method = methods[i]
    self[method] = function (route, fn) {
      self._add_route(method, route, fn)
    }
  }
}

// (method, route, fn) -> undefined
//
// Params:
//  method: The method to match to. undefined is matches all.
//  route: The route to match to. undefined is matches all.
//  handler: The handler to callback if the method & route matches.
//
// Desc:
//  Used internally by all the add route functions, such as `self.get()`,
//  `self.all()` and `self.use()`
proto._add_route = function (method, route, handler) {
  this.stack.push({
      'method': method
    , 'route': route
    , 'handler': handler
  })
}

// (handler) -> undefined
//
// Params:
//  handler: The handler to callback on all events.
//
// Desc:
//  Match all events given to this app.
proto.all = function (handler) {
  this._add_route(undefined, undefined, handler)
}

// (route, fn) -> undefined
//
// Params:
//  route: The route to match to. Undefined matches all.
//  fn: The function to call if the route is matched
//
// Desc:
//  Add middleware to this app. Currently this feature just adds a route
//  handler, but we're calling that middleware.
proto.use = function (route, handler) {
  this._add_route(undefined, route, handler)
}