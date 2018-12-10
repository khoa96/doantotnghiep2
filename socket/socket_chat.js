const User = require('../models/user')
const Room = require('../models/room');
const express =  require('express');
const router = express.Router();
module.exports = function(io, arrUser) {

    io.on('connection', function(socket) { 
	   // lang nghe su kien tim kiem nguoi dung de them vao nhom.
	   socket.on('client-send-search-username-to-server', (data) => {
		
		User.find({username: new RegExp(data.username, 'i'), _id: {$nin: data.userIds}}, function(err, users) {
		   if(err) {
			   console.log(err);
		   } else {
			 if(users.length > 0) {
				socket.emit('server-send-search-result-by-name-to-client', users);
			 }
		   }
		});
	   })

	   // lang nghe su kie tao nhom chat (create group chat)
	   socket.on('create-group-chat', (data) => {
		   const groupName = data.groupName;
		   const arrUserId = data.arrUserId;
		   const room = new Room({
			   name: groupName,
			   members: arrUserId
		   });
		 room.save((err, room) => {
			   if(err) {
				   console.log(err);
			   } else {
				   // lay toan bo thong tin cua cac thanh vien trong nhom
				//    Room.findById({_id: group._id}).populate('members').exec((err, results) => {
				// 	   if(err) {
				// 		   console.log(err);
				// 	   } else {
				// 		   console.log(results);
				// 	   }
				//    })
				
				// emit thong tin create nhom den tat ca cac thanh vien trong nhom.
				
			
			   }
		})

	   })
      
    });

    return router;
}