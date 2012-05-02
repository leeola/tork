#!/usr/bin/env node
//
// lib/app.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/
var utils = require('./utils')


// () -> Function
//
// Returns:
//  A function which hands off the given request object to `app.handle(req)`
//
// Desc:
//  Create a tork instance.
module.exports.create = function () {
  function app(req) {
    this.handle(req)
  }
  
  utils.merge(app, proto)
  app.init()
  return app
}

// The 'prototype' for our app object.
var proto = module.exports.proto = {}

// () -> undefined
proto.init = function () {
}