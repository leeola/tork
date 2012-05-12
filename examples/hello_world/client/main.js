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

app.get('/bar', function () {
  console.log('Hello /bar')
  alert('Hello /bar')
})

app.get('#raz', function () {
  console.log('Hello #raz')
  alert('Hello #raz')
})

app.listen('http')