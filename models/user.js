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
	  }
})
//authenticate input against database
// tao hai phuong thuc cho passport
// 1. ma hoa mat khau.(ham truyen vao mat khau)
userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// kiểm tra mật khẩu có trùng khớp
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');