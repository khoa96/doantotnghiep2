const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const socketSchema = new Schema({
	id_send: {type: String}, 
	socket_id: {type: String}
})
// id_send: la id cua user.
// socket_id: moi user khi connect se co 1 socket ==> moi socket co 1 id.
module.exports = mongoose.model('Socket', socketSchema, 'sockets');