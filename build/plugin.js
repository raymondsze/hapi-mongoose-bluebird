'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-04 02:30:14
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:42:10
*/

const util = require('util');
const path = require('path');
const _ = require('lodash');
const Schema = require('./schema');
const mongoose = require('mongoose');
const importDirectory = require('import-directory');

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
			_.each(dirs, dir => {
				const relativePath = path.relative(__dirname, process.cwd() + '/' + dir);
				importDirectory(module, relativePath, {
					visit: function visit(obj) {
						if (!_.isUndefined(obj)) {
							let mongooseModels = _.isArray(obj) ? obj : [obj];
							_.each(mongooseModels, model => {
								if (model.model && model.model.name && model.model.name === 'model') {
									models[model.modelName] = model;
								}
							});
						}
					}
				});
			});
			server.expose('models', models);
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
