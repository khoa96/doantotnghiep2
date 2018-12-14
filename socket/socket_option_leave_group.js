const User = require('../models/user')
const Room = require('../models/room')
const express =  require('express');
const router = express.Router();
module.exports = function(io) {

	io.on('connection', function(socket) { 
		 // lang nghe su kien user roi khoi nhom chat.
		 socket.on('client-leave-group', (data) => {
			Room.findByIdAndUpdate(data.group, {$set: {members: data.arrUserIds}}, (err, result) => {
				if(err) {
					console.log(err)
				} else {
					socket.emit('server-respone-user-leave-group-to-client', data)
				}
			})
		 })
		
	});

  return router;
}