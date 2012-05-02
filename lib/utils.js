#!/usr/bin/env node
//
// lib/utils.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/


// (a, b) -> a + b
//
// Params:
//  a: The instance to be written on
//  b: The instance to write onto a
//
// Returns:
//  The returned object is `a` with the contents of `b` written ontop of it.
//  This is very unsafe, and it will most likely injur your dog.
//
// Desc:
//  A simple and unsafe merge of objects a and b. 
exports.merge = function (a, b) {
  for (var key in b)
    a[key] = b[key]
}

// (a, b) -> a + b
//
// Params:
//  a: The instance to be written on
//  b: The instance to write onto a
//
// Returns:
//  The returned object is `a` with the contents of `b` written ontop of it.
//  This is very unsafe, and it will most likely injur your dog.
//
// Raises:
//  Error('fail_merge found the same key in both object a and b. '+
//    'The offending key:'+ key)
//
// Desc:
//  A simple merge of objects a and b. The difference with `merge` is that
//  this will throw an exception if any overlap between a and b is found.
exports.fail_merge = function (a, b) {
  for (var key in b) {
    if (key in a) {
      throw new Error('fail_merge found the same key in both object a and b. '+
        'The offending key:'+ key)
    } else {
      a[key] = b[key]
    }
  }
}