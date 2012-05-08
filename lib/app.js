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
// The nodejs url module. This may not compile to the user, we'll see.
var url = require('url')


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
    self._add_method(methods[i])
  }
}

// (method) -> undefined
//
// Params:
//  method: The method to add to this object.
//
// Desc:
//  An internal method used to add.. http methods.. to this object. Bit of
//  overlap/confusion possible with the `method` name.. but it's an internal
//  function.. i'm going to live on the wild side of life.
proto._add_method = function (method) {
  var self = this
  self[method] = function (route, fn) {
    self._add_route(method, route, fn)
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
  // Check if handler is the 1st/2nd params
  if (typeof method === 'function') {
    handler = method
    method = route = undefined
  } else if (typeof route === 'function') {
    handler = route
    route = undefined
  }
  
  if (route)
    route = utils.format_route_pattern(route)
  
  this.stack.push({
      'method': method
    , 'route': route
    , 'handler': handler
  })
}

// (index, req) -> undefined
//
// Params:
//  index: The index of the stack currently being iterated over.
//  req: The request object given to `self.handle(req)`
//
// Desc:
//  Iterate over the stack, calling any handlers found in the stack that
//  match the req objects information.
proto._iterate_stack = function (index, req, passed_args) {
  var self = this
    , stack_item = this.stack[index]
    
  if (passed_args === undefined)
    passed_args = []
  
  // If stackitem is undefined, there are no more routes to try and match.
  if (stack_item === undefined)
    return undefined
  
  if (stack_item.method) {
    // If the item method and req method don't match, proceed
    // to the next stack item, and end this one.
    if (stack_item.method !== req.method)
      return this._iterate_stack(++index, req)
  }
  
  if (stack_item.route) {
    // If the item route and req href don't match, proceed
    // to the next stack item, and end this one.
    if (!stack_item.route.test(req.href))
      return this._iterate_stack(++index, req)
  }
  
  // DESCRIBE CODE PATH
  // If we've made it this far, method and route are acceptable matches (or
  // match alls)
  
  
  // Our handler callback. Aptly named, `handler_callback`!
  var handler_callback = function () {
    // If this function was not given any arguments, we have nothing to do
    // here.
    if (arguments.length > 0) {
      // Convert `arguments` to an array
      var args = Array.prototype.slice.call(arguments, 0)
      Array.prototype.push.apply(passed_args, args)
    }
    self._iterate_stack(++index, req, passed_args)
  }
  
  if (passed_args.length > 0) {
    // If we have any passed_args, put them in the middle of req & next(),
    // then call the handler.
    
    // Build our argument array
    var handler_args = [req]
    Array.prototype.push.apply(handler_args, passed_args)
    handler_args.push(handler_callback)
    
    // Now that we're all done, call the handler!
    stack_item.handler.apply(stack_item.handler, handler_args)
    
  } else {
    // We have no passed args, so just call the handler with req & next()
    
    stack_item.handler(req, handler_callback)
  }
}

// (handler) -> undefined
//
// Params:
//  route: The route to match to. Undefined matches all.
//  handler: The handler to callback if the route matches.
//
// Desc:
//  Similar to get/put/etc, except this matches all methods.
proto.all = function (route, handler) {
  this._add_route(undefined, route, handler)
}

// (req) -> undefined
//
// Params:
//  req: A request object, currently consisting of the following minimum data..
//    {
//        'method': 'get'
//      , 'url': '/'
//    }
//    Note that the app will parse the url and add to the request object.
//    So, things like hostname, port, etc, will be taken care of.
//
// Desc:
//  Create an event for this app to handle. This basically just starts the
//  `self._iterate_stack()` function.
proto.handle = function (req) {
  var stack_index = 0
    , parsed_url = url.parse(req.url)
  utils.merge(parsed_url, req)
  this._iterate_stack(stack_index, parsed_url)
}

// (route, fn) -> undefined
//
// Params:
//  method: The method to match to. Undefined matches all.
//  route: The route to match to. Undefined matches all.
//  fn: The function to call if the route is matched
//
// Desc:
//  Add middleware to this app. Currently this feature just adds a route
//  handler, but we're calling that middleware.
proto.use = function (method, route, handler) {
  this._add_route(method, route, handler)
}