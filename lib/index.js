#!/usr/bin/env node
//
// lib/index.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/
var app = require('./app')

exports = module.exports = app.create

exports.app = app
exports.utils = require('./utils')