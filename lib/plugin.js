/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-04 02:30:14
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 00:42:30
*/

const util = require('util');
const _ = require('lodash');
const Fs = require('fs');
const Schema = require('./schema');
const mongoose = require('mongoose');
const Promise = require('bluebird');

// This plugin is used to make hapi support handler as async function
function register(server, options, next) {
	const registerAsync = async function () {
		const config = await Schema.validateAsync(options);
		mongoose.Promise = require('bluebird');
		// set up the mongodb path
		const mongodbPath = config.username ?
			'mongodb://' + config.username + ':' + config.password + '@' + config.host + ':' + config.port + '/' + config.database :
			'mongodb://' + config.host + ':' + config.port + '/' + config.database;
		server.ext('onPreStart', async function (emitter, after) {
			mongoose.connect(mongodbPath, config.opts || {}, (err) => {
				if (err) {
					return after(err);
				}
				server.log(['info'], util.format('Connection with %s succeeded.', mongodbPath));
				after();
			});
		});

		server.ext('onPreStop', async function (emitter, after) {
			mongoose.disconnect((err) => {
				if (err) {
					return after(err);
				}
				server.log(['info'], util.format('Server is going to stop, disconnect from %s', mongodbPath));
				after();
			});
		});

		let models = {};
		const dirs = config.models;
		const promises = _.map(dirs, (dir) => {
			return new Promise((resolve, reject) => {
				Fs.readdir(process.cwd() + '/' + dir, (err, fileList) => {
					if (err) {
						reject(err);
					} else {
						resolve(_.map(fileList, (file) => {
							const path = process.cwd() + '/' + dir + '/' + file;
							return require(path);
						}));
					}
				});
			});
		});
		Promise.all(promises).then((mongooseModels) => {
			_.each(_.flatten(mongooseModels, true), (model) => {
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
	};
	registerAsync().then(() => next()).catch((error) => {
		next(error);
	});
}

register.attributes = {
	pkg: require('../package.json')
};

module.exports = {
	register: register
};
