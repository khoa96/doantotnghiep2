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
	avatar_group: {
		type: String
	},
	avatar_send: {
		type: String
	},
	avatar_recepient: {
		type: String
	},
	username_send: {type: String},
	username_recepient: {type: String},
	messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
	members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	type: {
		type: String
	},
	id_creator_group: {type: String} 
})

module.exports = mongoose.model('Room', roomSchema, 'rooms');