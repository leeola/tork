#!/usr/bin/env node
//
// lib/methods.js
//
// The methods that the tork app will handle. Note that these also have
// 'made up' methods for client<->tork<->server communication. 
//
// @copyright 2012 by Lee Olayvar
//
/*jshint asi: true, laxbreak: true*/

module.exports = [
    'get'
  , 'post'
  , 'head'
  , 'delete'
  , 'options'
  
  // The following method(s) are for data being routed back
  // to the client from the server.
  , 'server'
]