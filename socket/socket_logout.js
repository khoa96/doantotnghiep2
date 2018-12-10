const User = require('../models/user')
const express =  require('express');
const router = express.Router();
module.exports = function(io) {

io.on('connection', function(socket) { 
		// lang nghe su kien client  logout
		socket.on('client-logout', (data) => {
			// B1 : update lai status cua user : status =off.
			User.findByIdAndUpdate(data, {$set: {state: 'off'}}, (err, result) => {
				if(err) {
					console.log(err)
				} else {
					socket.broadcast.emit('server-broadcast-user-logout-to-client',data);
				}
			})
		});
	 });
  return router;
}