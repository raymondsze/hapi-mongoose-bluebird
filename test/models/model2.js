/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-01 03:05:37
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:35:13
*/

const mongoose = require('mongoose');

const m1Schema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	}
});

const m2Schema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	}
});

module.exports = [mongoose.model('Model1', m1Schema, 'Model1s'), mongoose.model('Model2', m2Schema, 'Model2s')];
