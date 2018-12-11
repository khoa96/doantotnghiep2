const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	color: {
		type: String
	},
	avatar: {
		type: String
	},
	messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
	members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Room', roomSchema, 'rooms');