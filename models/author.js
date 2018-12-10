const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authorSchema = new Schema ({
	name: String,
	age: Number,
	stories: [{type: mongoose.Schema.Types.ObjectId,  ref: 'Story'}]
})

module.exports = mongoose.model('Author', authorSchema, 'authors');