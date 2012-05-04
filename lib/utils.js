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

// (pattern) -> RegExp()
//
// Params:
//  pattern: A regexy string or a RegExp object.
//
// Returns:
//  A RegExp object.
//
// Desc:
//  Format the given pattern with some basics things like enforcing start
//  matching, end match, and end slash ignoring.
exports.format_route_pattern = function (pattern) {
  // Stringify our pattern so we can work with it, if it's not already a string
  if (pattern.source)
    pattern = pattern.sourece
  
  // Check for the start op, so that the regex only matches from the start.
  if (pattern.indexOf('^') !== 0)
    pattern = '^'+ pattern
  
  // Check for the end op, and if it exists remove it.
  // This will allow us to work on it, without having to offset the end op.
  if (pattern.lastIndexOf('$') === pattern.length - 1)
    pattern = pattern.substring(0, pattern.length - 1)
  
  if (pattern.lastIndexOf('[\\/]?') !== pattern.length - 5) {
    // Check for the optional ending slash pattern. If it
    // already exists, we can safely ignore this step.
    
    if (pattern.lastIndexOf('\\/') === pattern.length - 2) {
      // Check for the ending slash on domains. If it exists, replace it
      // with an optional end slash.
      
      pattern = pattern.substring(0, pattern.length - 2) +'[\\/]?'
    }
    else {
      // Since we have not found the user trying to add in an ending slash,
      // add our own.
      
      pattern = pattern +'[\\/]?'
    }
  }
  
  // Return our RegExp object. Make sure to append our ending op.
  return RegExp(pattern + '$')
}