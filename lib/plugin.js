/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-04 02:30:14
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:12:32
*/

const util = require('util');
const path = require('path');
const _ = require('lodash');
const Schema = require('./schema');
const mongoose = require('mongoose');
const importDirectory = require('import-directory');

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
		_.each(dirs, (dir) => {
			const relativePath = path.relative(__dirname, process.cwd() + '/' + dir);
			importDirectory(module, relativePath, {
				visit: function (obj) {
					if (!_.isUndefined(obj)) {
						let mongooseModels = _.isArray(obj) ? obj : [obj]; 
						_.each(mongooseModels, (model) => {
							if (model.model && model.model.name && model.model.name === 'model') {
								models[obj.modelName] = obj;
							}
						});
					}
				}
			});
		});
		server.expose('models', models);
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
