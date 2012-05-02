#!/usr/bin/env node
//
// lib/app.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/
var utils = require('./utils')


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
proto.init = function () {
}