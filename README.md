## hapi-mongoose-bluebird [![Build Status](https://travis-ci.org/raymondsze/hapi-mongoose-bluebird.svg)](https://travis-ci.org/raymondsze/hapi-mongoose-bluebird.svg?branch=master)
## Not Maintained
:exclamation: I haven't use Hapi framework for a long time. This repository is no longer maintained.

## Introduction
<p>1. This plugin can connect mongodb when server onPreStart phase and end connection whtn server onPreStop. (require Hapi 11+)</p>
<p>2. Enable scan models by array of directory path.</p>
<p>3. models can be accessible from server.plugins['hapi-mongoose-bluebird'].models.</p>
<p>4. mongoose can be accessible from server.plugins['hapi-mongoose-bluebird'].mongoose.</p>
<p>You may use server.decorate in the callback to prevent always typing the long path server.plugins['hapi-mongoose-bluebird']</p>
```javascript
server.decorate('server', 'mongoose', server.plugins['hapi-mongoose-bluebird'].mongoose);
server.decorate('server', 'models', server.plugins['hapi-mongoose-bluebird'].models);
```

## Install
<p>Note: <a href="https://github.com/petkaantonov/bluebird">Bluebird</a> and <a href="http://mongoosejs.com/">Mongoose</a> are required, the Promise return from the mongoose is not M-Promise but Bluebird.</p>
<p><b>npm install --save bluebird mongoose</b></p>

<p><b>npm install --save hapi-mongoose-bluebird</b></p>

## Options
<p><b>host</b>(Required)</p>
<p><b>port</b>(Required)</p>
<p><b>username</b>(Optional)</p>
<p><b>password</b>(Optional)</p>
<p><b>opts</b>(Optional): This is the option passed to mongoose.</p>
<p><b>models</b> (Optional): This is the array of dir path you want to scan the models</p>
<p>The file inside the directory should <b>module.exports</b> or <b>export default</b> the following</p>
<p>1. A mongoose model instance </p>
<p>2. An array of mongoose model instance </p>
<p>Example:</p>
```javascript
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'USER'
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('User', schema, 'Users');
```

## Example
<p>Please visit the test case for example reference. </p>
<a href= "https://github.com/raymondsze/hapi-mongoose-bluebird/tree/master/test">Example usage</a>

## LICENSE
The MIT License (MIT)

Copyright (c) 2016 Sze Ka Wai Raymond

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
