const User = require('../models/user')
const Room = require('../models/room')
const Socket = require('../models/socket')
const express =  require('express')
const router = express.Router();
module.exports = function(io, arrUser) {
	 
	//  funtion lay tim kiem id cua socket trong mang socket .
	function getSocketId (arrUser, UserId){
		for(var i = 0 ; i < arrUser.length; i++){
			if(arrUser[i].id_send == UserId){
				return arrUser[i].socket_id;
			}
		}
	}
    io.on('connection', function(socket) { 
	   // lang nghe su kien tim kiem nguoi dung de them vao nhom.
	   socket.on('client-send-search-username-to-server', (data) => {
		User.find({username: new RegExp(data.username, 'i'), _id: {$nin: data.userIds}}, function(err, users) {
		   if(err) {
			   console.log(err)
		   } else {
			 if(users.length > 0) {
				socket.emit('server-send-search-result-by-name-to-client', users);
			 }
		   }
		});
	   })

	   // lang nghe su kie tao nhom chat (create group chat)
	   socket.on('create-group-chat', (data) => { 
			// neu room chat da ton tai thi ko them.
			Room.findOne({name: data.name}, (err, result) => {
				if(err) {
					console.log(err);
				} else {
					if(result != null || result != undefined) {
					
						socket.emit('server-send-error-create-room-to-client', result);
					} else {
					// 	room.save((err, room) => {
					// 		if(err) {
					// 			console.log(err);
					// 		} else {
					// 			// lay toan bo thong tin cua cac thanh vien trong nhom
					// 		//    Room.findById({_id: group._id}).populate('members').exec((err, results) => {
					// 		// 	   if(err) {
					// 		// 		   console.log(err);
					// 		// 	   } else {
					// 		// 		   console.log(results);
					// 		// 	   }
					// 		//    })
							
					// 		// emit thong tin create nhom den tat ca cac thanh vien trong nhom.
					// 		socket.emit('server-broadcast-group-chat-to-client', room);
					// 		arrUserId.forEach((userId) => {
					// 			socket.to(getSocketId(arrUser, userId)).emit('server-broadcast-group-chat-to-client', room);
					// 		})
							
					// 	}
					//    })

					// khi nhom khong trung nnhau ==> them vao trong csdl .
					 if(data.arrUserId.length  > 2) {
						 // chat private
						 let room = new Room ({
							 name: data.name,
							 avatar_group: data.avatar_group,
							 members: data.arrUserId,
							 type: 'group'
						 });
						 room.save((err, room) => {
							 if(err) {
								 console.log(err);
							 } else {
								socket.emit('server-broadcast-group-chat-to-client', room);
								data.arrUserId.forEach((userId) => {
									socket.to(getSocketId(arrUser, userId)).emit('server-broadcast-group-chat-to-client', room);
							 	})
							 }
						 })
					 }
					 if(data.arrUserId.length == 2) {
						 // chat private.
						 let room = new Room({
							 name: data.name,
							 username_send: data.username_send,
							 username_recepient: data.username_recepient,
							 avatar_send: data.avatar_send,
							 avatar_recepient: data.avatar_recepient,
							 id_creator_group: data.id_creator_group,
							 members: data.arrUserId,
							 type: 'private'

						 })
						 room.save((err, room) => {
							 if(err ) {
								 console.log(err);
							 } else {
								socket.emit('server-broadcast-private-chat-to-client', room);
								data.arrUserId.forEach((userId) => {
									socket.to(getSocketId(arrUser, userId)).emit('server-broadcast-private-chat-to-client', room);
							 	})
							}
						 })
					 }
				  }
				}
			})
	   })
      
    });

    return router;
}