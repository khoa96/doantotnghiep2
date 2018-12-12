
const express =  require('express');
const User =  require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message')
const router = express.Router();
module.exports = function(io, arrUser) {

    io.on('connection', function(socket) { 
		socket.on('client-request-change-name-group-to-serve', function(data){
			 const message = new Message({
				 creator: data.creator,
				 body: data.body,
				 time: data.time,
				 group: data.group,
				 type: 'text'
			 })
			 message.save((err, message) => {
				 if(err) {
					 console.log(err);
				 } else {
					 // sau khi luu tin nhan ==> update ten nhom
					 Room.findByIdAndUpdate(data.group, {name: data.groupName }, (err, room) => {
						 if(err) {
							 console.log(err)
						 } else {
							 // emit ve tat cac cac user trong nhom
							 io.sockets.in(socket.room).emit("server-broadcast-change-name-group-to-group",data);
						 }
					 })
				 }
			 })
			
	
		});
      
    })

    return router;
}