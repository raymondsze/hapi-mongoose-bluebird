'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-04 02:30:14
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 03:44:47
*/

const util = require('util');
const _ = require('lodash');
const Fs = require('fs');
const Schema = require('./schema');
const mongoose = require('mongoose');
const Promise = require('bluebird');

// This plugin is used to make hapi support handler as async function
function register(server, options, next) {
	const registerAsync = function () {
		var ref = _asyncToGenerator(function* () {
			const config = yield Schema.validateAsync(options);
			mongoose.Promise = require('bluebird');
			// set up the mongodb path
			const mongodbPath = config.username ? 'mongodb://' + config.username + ':' + config.password + '@' + config.host + ':' + config.port + '/' + config.database : 'mongodb://' + config.host + ':' + config.port + '/' + config.database;
			server.ext('onPreStart', function () {
				var ref = _asyncToGenerator(function* (emitter, after) {
					mongoose.connect(mongodbPath, config.opts || {}, err => {
						if (err) {
							return after(err);
						}
						server.log(['info'], util.format('Connection with %s succeeded.', mongodbPath));
						after();
					});
				});

				return function (_x, _x2) {
					return ref.apply(this, arguments);
				};
			}());

			server.ext('onPreStop', function () {
				var ref = _asyncToGenerator(function* (emitter, after) {
					mongoose.disconnect(err => {
						if (err) {
							return after(err);
						}
						server.log(['info'], util.format('Server is going to stop, disconnect from %s', mongodbPath));
						after();
					});
				});

				return function (_x3, _x4) {
					return ref.apply(this, arguments);
				};
			}());

			let models = {};
			const dirs = config.models;
			const promises = _.map(dirs, dir => {
				return new Promise((resolve, reject) => {
					Fs.readdir(process.cwd() + '/' + dir, (err, fileList) => {
						if (err) {
							reject(err);
						} else {
							resolve(_.map(fileList, file => {
								const path = process.cwd() + '/' + dir + '/' + file;
								return require(path);
							}));
						}
					});
				});
			});
			yield Promise.all(promises).then(mongooseModels => {
				_.each(_.flatten(mongooseModels, true), model => {
					if (model.model.name === 'model') {
						// registers all the models specified in config
						models[model.modelName] = model;
					}
				});
				// expose the variables, could be access by server.plugins[...].models or request.server.plugins[...].models
				server.expose('models', models);
			});

			// expose the variables, could be access by server.plugins[...].mongoose or request.server.plugins[...].mongoose
			server.expose('mongoose', mongoose);
		});

		return function registerAsync() {
			return ref.apply(this, arguments);
		};
	}();
	registerAsync().then(() => next()).catch(error => {
		next(error);
	});
}

register.attributes = {
	pkg: require('../package.json')
};

module.exports = {
	register: register
};
