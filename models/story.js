const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const storySchema = new Schema({
     creator: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
     title: String
})

module.exports = mongoose.model('Story', storySchema , 'Stories');