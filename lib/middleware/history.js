//
// lib/middleware/history.js
//
// A History API middleware that will merge with a client object
// adding push/pop/etc functionality.
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxcomma: true*/
var utils = require('../utils')


exports = module.exports = function () {
  // Our client object that we are going to merge/pass on.
  var hist_obj = {
    'type': 'client'
  }
  
  hist_obj.push = function (req, options) {
    if (options == undefined)
      options = {
        'disallowed_sources': ['history']
      }
    
    if (options.disallowed_sources != undefined &&
        options.disallowed_sources.indexOf(req.event.source) < 0) {
      hist_obj.push_state(req, 'undefined', req.href)
    }
  }
  
  hist_obj.push_state = hist_obj.pushState = function (state, title, url) {
    window.history.pushState(state, title, url)
  }
  
  hist_obj.replace = function (url) {
    hist_obj.replace_state(undefined, 'undefined', url)
  }
  
  hist_obj.replace_state = 
    hist_obj.replaceState = function (state, title, url) {
    window.history.replaceState(state, title, url)
  }
  
  hist_obj.state = window.history.state
  
  
  // Our middleware function
  var middleware = function () {
    var middlewares = Array.prototype.slice.apply(arguments)
      , req = middlewares.splice(0, 1)
      , next = middlewares.pop()
    
    // Check other middlewares for client objects. If we find one, merge
    // it and ours together.
    for (var i = 0; i < middlewares.length; i++) {
      var middleware_obj = middlewares[i]
      if (middleware_obj.type == 'client') {
        utils.merge(middlewares[i], hist_obj)
        return undefined
      }
    }
    
    // If we get this far, no other middlewares match client type. So pass
    // our middleware object.
    next({'history': hist_obj})
    return undefined
  }
  
  // Return the middleware
  return middleware
}