const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = new Schema({
	username : {
		type: String,
		required: true,
		trim: true
	  },
	  email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	  },
	  password: {
		type: String,
		required: true,
	  },
	  avatar: {
		  type: String,
		  require: true
		},
		state: {
			type: String,
			default: 'off'
		},
		notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}],
		groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Room'}],
		messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
})
//authenticate input against database
userSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email, password: password })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      } else {
				return callback(null, user)
			}
    });
}
var User = mongoose.model('User', userSchema);
module.exports = User;