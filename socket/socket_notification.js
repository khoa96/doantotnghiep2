const User = require('../models/user')
const Notification = require('../models/notification')
const express =  require('express');
const router = express.Router();
module.exports = function(io, arrUser) {

io.on('connection', function(socket) { 
		// lang nghe su kien client gui thong bao len phia server.
		socket.on('client-send-notification-to-server', (data) => {
			const creator = data.id_send; // nguoi gui
			const body = data.body;
			const id_recepient  = data.id_recepient; // nguoi nhan
			const time = data.time;
			const notification = new Notification({
			   creator: creator,
			   body: body, 
			   time: time
			})
			notification.save((err, notification) => {
				if(err){
					console.log(err)
				} else {
				
					// sau khi luu thong bao thanh cong ==> emit thong bao den thanh vien gui tin nha.
					for(var i = 0;i < arrUser.length; i++){
						if(arrUser[i].id_send == id_recepient ){
							socket.to(arrUser[i].socket_id).emit('server-send-notification-to-client', data);
							//console.log('emit thanh cong')
							break;
						}
					}
					
			
				}
			})

		})
	 });
  return router;
}