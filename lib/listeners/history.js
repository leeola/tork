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
  }
  
  window.onpopstate = function (event) {
    console.log('Location: '+ document.location +', state: '+ JSON.stringify(event.state))
  }
}