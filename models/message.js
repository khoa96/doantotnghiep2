const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
	creator: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	body: {
		type: String
	},
	time: {
		type: Date
	},
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Room'
	},
	type: {
		type: String,
		default: 'text'
	}

})

module.exports = mongoose.model('Message', messageSchema, 'messages');