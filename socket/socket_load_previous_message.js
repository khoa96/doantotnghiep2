const Message = require('../models/message')
const express =  require('express');
const router = express.Router();
module.exports = function(io) {

io.on('connection', function(socket) { 
		// lang nghe su kien client  logout.
		socket.on('client-request-load-previous-message', (data) => {
			const group = data.group;
			const sum_message = data.sum_message;
			Message.find({group: group}).populate('creator').sort({time:-1}).skip(sum_message).limit(10).exec((err, messages) => {
				if(err){
					console.log(err)
				} else {
				   if(messages.length > 0) {
					   console.log(messages)
					   socket.emit('server-send-previous-message-group-to-client', messages)
				   }
				}
			})
		})
	 });
  return router;
}