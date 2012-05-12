#!/usr/bin/env node
//
// server/main.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed 
//
/*jshint asi: true, laxcomma: true*/
var browserify = require('browserify')
  , express = require('express')

var html = '<html><head>'+
  '<script type="text/javascript" src="/browserify.js"></script>'+
  '</head><body><h1>Hello World</h1><ul>'+
  '<li><a id="test" href="/foo">Link /foo</a></li>'+
  '<li><a href="/bar">Link /bar</a></li>'+
  '<li><a href="#baz">Link #baz</a></li>'+
  '<li><a href="#raz">Link #raz</a></li>'+
  '</body></html>'

var app = express.createServer()

app.configure(function () {
  app.use(express.logger())
  app.use(express.errorHandler({
    dumbExceptions: true,
    showStack: true
  }))
  app.use(browserify(__dirname + '/../client/main.js', {
    'cache': __dirname +'/../.browserify_cache.json'
  }))
})

app.get('/', function (req, res) {
  res.send(html)
})

app.listen(process.env.PORT ? process.env.PORT : 8080)