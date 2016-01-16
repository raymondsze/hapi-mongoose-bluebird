'use strict';

/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-03 21:52:13
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 00:01:10
*/

const Promise = require('bluebird');
const Joi = require('joi');

module.exports = Promise.promisifyAll(Joi.object({
	host: Joi.string().hostname().required(),
	port: Joi.number().integer().min(0).max(99999).required(),
	username: Joi.string().min(1).optional(),
	password: Joi.string().min(1).optional(),
	database: Joi.string().min(1).required(),
	opts: Joi.object().default({}).optional(),
	models: Joi.array().items(Joi.string())
}));
