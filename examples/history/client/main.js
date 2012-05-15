#!/usr/bin/env node
//
// client/main.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed 
//
/*jshint asi: true, laxcomma: true*/
var tork = require('../../../lib')

var app = tork()

// Add our history middleware. This will add the client object to
// each following handler.
app.use(tork.middleware.history())

app.get('/foo', function (req, client) {
  client.history.push(req)
  alert('Hello /foo')
})

app.get('/foo/bar', function (req, client) {
  client.history.push(req)
  alert('Hello /foo/bar')
})

app.get('/baz', function (req, client) {
  client.history.push(req)
  alert('Hello /baz')
})

app.listen('http', 'history')