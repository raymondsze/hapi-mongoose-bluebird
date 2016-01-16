## hapi-async-methods [![Build Status](https://travis-ci.org/raymondsze/hapi-mongoose-bluebird.svg)](https://travis-ci.org/raymondsze/hapi-mongoose-bluebird.svg?branch=master)
## Introduction
<p>1. This plugin can connect mongodb when server onPreStart phase and end connection whtn server onPreStop.</p>
<p>2. Enable scan models by array of directory path.</p>
<p>3. models can be accessible from server.plugins['hapi-mongoose-bluebird'].models.</p>
<p>4. mongoose can be accessible from server.plugins['hapi-mongoose-bluebird'].mongoose.</p>
<p>You may use server.decorate in the callback to prevent always typing the long path server.plugins['hapi-mongoose-bluebird']</p>
```javascript
server.decorate('server', 'mongoose', server.plugins['hapi-mongoose-bluebird'].mongoose);
server.decorate('server', 'models', server.plugins['hapi-mongoose-bluebird'].models);
```

## Install
<p>Note: Bluebird and Mongoose is required, the Promise return from the mongoose is not mPromise but Bluebird.</p>
<p><b>npm install --save bluebird mongoose</b></p>

<p><b>npm install --save hapi-mongoose-bluebird</b></p>

## Options
<p><b>host</b>(Required)</p>
<p><b>port</b>(Required)</p>
<p><b>username</b>(Optional)</p>
<p><b>password</b>(Optional)</p>
<p><b>opts</b>(Optional): This is the option passed to mongoose.</p>
<p><b>models</b> (Optional): This is the array of dir path you want to scan the models</p>
<p>The file inside the directory should be like that</p>
```javascript
const mongoose = require('mongoose');

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