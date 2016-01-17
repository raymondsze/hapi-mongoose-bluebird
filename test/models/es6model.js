/* 
* @Author: Sze Ka Wai Raymond (FakeC)
* @Date:   2016-01-01 03:05:37
* @Last Modified by:   Sze Ka Wai Raymond (FakeC)
* @Last Modified time: 2016-01-17 22:36:41
*/

import mongoose from 'mongoose';

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

schema.methods.getInfo = async function () {
	return {
		id: this.id,
		username: this.username,
		email: this.email,
		role: this.role
	};
};

export default mongoose.model('ES6User', schema, 'ES6Users');
