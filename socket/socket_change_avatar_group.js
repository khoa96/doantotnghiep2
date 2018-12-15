const User = require('../models/user')
const express =  require('express')
const Room = require('../models/room')
const fs  = require('fs')

const router = express.Router();
module.exports = function(io) {

	io.on('connection', function(socket) { 
		socket.on('client-change-avatar-group-to-server', (data) => {
			 const group = data.group;
			 const  avatar = data.avatar;
			 
			 Room.findByIdAndUpdate(group, {avatar_group: avatar }, (err, room) => {
				if(err) {
					console.log(err)
				} else {
					// emit ve tat cac cac user trong nhom
					
					io.sockets.in(socket.room).emit("server-broadcast-change-avatar-group-to-group",data);
				}
			})
		})
		
	})
			
  return router;
}