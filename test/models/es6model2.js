/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-01 03:05:37
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:36:51
*/

import mongoose from 'mongoose';

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

export default [mongoose.model('ES6Model1', m1Schema, 'ES6Model1s'), mongoose.model('ES6Model2', m2Schema, 'ES6Model2s')];
