/*
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-01 02:43:46
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 00:47:50
*/

const server = require('./server');
const Lab = require('lab');
const Code = require('code');
const lab = Lab.script();
lab.experiment('async methods', {timeout: 10000}, function () {
	const pluginOptions = {
		host: 'localhost',
		port: 27017,
		database: 'test',
		models: ['./test/models']
	};

	lab.test('register hapi-mongoose-bluebird', (done) => {
		server.register({
			register: require('../build'),
			options: pluginOptions
		}, () => {
			server.start(() => {
				server.log(['info'], 'Server started at ' + server.info.uri);
				done();
			});
		});
	});
	lab.test('mongoose', (done) => {
		Code.expect(server.plugins['hapi-mongoose-bluebird'].mongoose).to.be.an.object();
		done();
	});
	lab.test('models', (done) => {
		Code.expect(server.plugins['hapi-mongoose-bluebird'].models).to.be.an.object();
		Code.expect(server.plugins['hapi-mongoose-bluebird'].models.User).to.be.an.function();
		Code.expect(server.plugins['hapi-mongoose-bluebird'].models.User.find().exec()).to.be.instanceof(require('bluebird'));
		done();
	});
});

module.exports = lab;
