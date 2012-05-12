#!/usr/bin/env node
//
// lib/listeners/http.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/

exports = module.exports = function (app) {
  var $ = require('jquery-browserify')
  
  $(document).ready(function () {
    $('a').click(function (event_data) {
      event.preventDefault()
      req = {
          'method': 'get'
        , 'url': $(event.target).attr('href')
        , 'name': event_data.target.innerText
      }
      
      var not_handled = function () {
        
      }
      
      app.handle(req, not_handled)
    })
  })
}