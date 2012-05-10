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
      app.handle({
          'method': 'get'
        , 'url': event_data.target.href
        , 'name': event_data.target.innerText
      })
      event.preventDefault()
    })
  })
}