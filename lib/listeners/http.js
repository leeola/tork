#!/usr/bin/env node
//
// lib/listeners/http.js
//
// Copyright (c) 2012 Lee Olayvar <leeolayvar@gmail.com>
// MIT Licensed
//
/*jshint asi: true, laxbreak: true*/
var $ = require('jquery-browserify')

exports = module.exports = function (app) {
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