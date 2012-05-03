#!/usr/bin/env node
//
// test/index.js
//
// Our main mocha target. Point mocha at this dir, and watch stuff happen.
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/

// Require all of the tests we want to run.
// Currently this seems to be the only way i can get mocha
// to recognize tests within the /test dir. I'm likely doing
// something wrong, but this works fine for now.
require('./creation')
require('./routing')
