#!/usr/bin/env node
//
// lib/app.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxcomma: true*/
var listeners = require('./listeners')
  , methods = require('./methods')
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
//  passed_args: A list of objects to pass into the handlers.
//  not_handled_fn: Called after all handles don't match the request.
//
// Desc:
//  Iterate over the stack, calling any handlers found in the stack that
//  match the req objects information.
proto._iterate_stack = function (index, req, passed_args, not_handled_fn) {
  var self = this
    , stack_item = this.stack[index]
    
  if (passed_args === undefined)
    passed_args = []
  
  // If stackitem is undefined, there are no more routes to try and match.
  if (stack_item === undefined) {
    if (not_handled_fn !== undefined)
      not_handled_fn(req)
    return undefined
  }
  
  if (stack_item.method) {
    // If the item method and req method don't match, proceed
    // to the next stack item, and end this one.
    if (stack_item.method !== req.method)
      return this._iterate_stack(++index, req, passed_args, not_handled_fn)
  }
  
  if (stack_item.route) {
    // If the item route and req href don't match, proceed
    // to the next stack item, and end this one.
    if (!stack_item.route.test(req.href))
      return this._iterate_stack(++index, req, passed_args, not_handled_fn)
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
    self._iterate_stack(++index, req, passed_args, not_handled_fn)
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

// (env1, env2, env3.., fn) -> undefined
//
// Params:
//  env: A string representing a possible environment. Any number of
//    environments can be listed as separate arguments.
//  fn: The function to call if any of the given envs match the app
//    environment.
//
// Desc:
//  Execute the given function if the environment(s) given match the
//  app environment.
proto.configure = function (fn) {
  // Convert arguments to an array, because JavaScript is stupid.
  var envs = Array.prototype.slice.call(arguments)
  
  // Grab the last argument and assume it's a function.
  fn = envs.pop()
  
  // If there are no envs given, or if `this.env` is in `envs`, call the
  // function.
  if (envs.length === 0 || envs.indexOf(this.env) >= 0)
    fn(this)
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
//  not_handled_fn: Called if no handlers match the request object.
//
// Desc:
//  Create an event for this app to handle. This basically just starts the
//  `self._iterate_stack()` function.
proto.handle = function (req, not_handled_fn) {
  var stack_index = 0
    , parsed_url = url.parse(req.url)
  utils.merge(parsed_url, req)
  this._iterate_stack(stack_index, parsed_url, [], not_handled_fn)
}

// Work in progress
proto.listen = function () {
  // Note that this function needs more in brwoserify testing to be complete.
  // The goal would be so that browserify only requires listeners added here
  // and thus avoids *some* amount of bloat. This works for the short
  // term goals though.
  
  for (var i = 0; i < arguments.length; i++) {
    var name = arguments[i]
      , listener = listeners[name]
    if (listener === undefined)
      throw new Error('Error: Cannot find module \'./listeners/'+ name +'\'')
    listener(this)
  }
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