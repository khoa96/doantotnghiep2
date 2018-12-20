const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
	creator: {type: mongoose.Types.ObjectId, ref: 'User'},
	body: { type: String},
	time: {type: Date}
})

module.exports = mongoose.model('Notification', notificationSchema, 'notifications')