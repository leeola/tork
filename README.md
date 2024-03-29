
# Tork.js - Client side routing and middleware

## Description

Tork.js is a work in progress that allows for common client side tasks to
be written in a familiar app centric server side style. It does this with a
code design modeled after Express.js, and with a dependancy of server side
compilers such as Browserify.

## Installation

via npm:

```bash
npm install tork
```

## Examples

Creation of a tork app is pretty basic

```js
var tork = require('tork')
var app = tork()
```

Then you're free to define Express-ish style handlers on the methods.

```js
app.get('/foo', function (req) {
  alert('Hello /foo')
})

app.get('#bar', function (req) {
  alert('Hello #bar')
})
```

We can also configure like Express!

Please remember, this is on the client side.. *so don't put anything stupid
in there.. like your database auth..*

```js
app.configure('development', function () {
  app.use(tork.middleware.logger({level: 'debug'}))
  app.log('We\'re doing development stuffs')
})

app.configure('production', function () {
  app.use(tork.middleware.logger({level: 'error'}))
  app.log('We\'re doing production stuffs')
})
```

Middleware is also supported

```js
app.use(tork.middleware.history())

app.get('/foo', function (req, client) {
  client.history.push(req.href)
  alert('HTML5 and Buzzwords here we come!')
})
```

Or roll your own middleware..

```js
var middleware = function (next) {
  // do stuff
  next()
}

app.use(middleware)
```

Now start listening to the client for events

```js
app.listen('http')
```

Note that listen just calls a function and passes itself as an argument.
That function is now responsible for creating 'requests' and passing them
to `app.handle(req)`. This means we can toss in our own event creating
goodness and ignore the poorly written http module!

```js
app.listen(require('./better_than_http'), require('./something_else'))
```

Next you would point Browserify to this file, start the server, and
that's basically it!

For more examples, view the source of `./examples/`

## Middleware

Currently middleware is in development. Really, this whole project is..
i'm surprsed that you're even reading this :)

## Browser Support

Browser support is currently untested. Ideally, in the end, `tork()` will
have great browser support as we can push stuff like the History API into
middleware so everyone can be happy.

Also, puppies and kittens will fall from the sky, and Internet Explorer will
perish in a terrible fire.

The end.

## Author

 - Lee Olayvar &lt;leeolayvar@gmail.com&gt;

## License

The MIT License (MIT)

Copyright (C) 2012 Lee Olayvar &lt;leeolayvar@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

