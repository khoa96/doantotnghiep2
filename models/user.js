const mongoose = require('mongoose');
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
	  }
})
//authenticate input against database
// UserSchema.statics.authenticate = function (email, password, callback) {
// 	User.findOne({ email: email })
// 	  .exec(function (err, user) {
// 		if (err) {
// 		  return callback(err)
// 		} else if (!user) {
// 		  var err = new Error('User not found.');
// 		  err.status = 401;
// 		  return callback(err);
// 		}
// 		bcrypt.compare(password, user.password, function (err, result) {
// 		  if (result === true) {
// 			return callback(null, user);
// 		  } else {
// 			return callback();
// 		  }
// 		})
// 	  });
//   }
  
  

module.exports = mongoose.model('User', userSchema, 'users');