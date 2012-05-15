//
// lib/listeners/history.js
//
// A listener that listens to history api changes. 
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/


exports = module.exports = function (app) {
  var $ = require('jquery-browserify')
  
  $(document).ready(function () {
    console.log('ready')
  })
  
  window.onpopstate = function (event) {
    
    if (event.state) {
      
      // Do a basic check to see if the state object is a previous
      // app request object. If it is, use that.
      if (event.state.url != undefined &&
          event.state.method != undefined &&
          event.state.href != undefined) {
            
        // We need to assign event.state locally because event seems to be
        // immutable.. or something. Confusing JavaScript i tell you.
        var req = event.state
        req.event = {
          'source': 'history'
        }
        app.handle(req)
      } else {
        app.handle({
            'url': document.location.pathname
          , 'method': 'get'
          , 'event': {
              'source': 'history'
            }
        })
      }
    }
    
    console.log('Location: '+ document.location +', state: '+ JSON.stringify(event.state))
  }
}