
const express =  require('express');
const router = express.Router();
module.exports = function(io, arrUser) {

    io.on('connection', function(socket) { 
        // lang nghe su kien client send user login to server
        socket.on('client-send-info-to-server',function(data){
            socket.id_send = data;
            var user = {
                socket_id : socket.id,
                id_send  : data
            }
            arrUser.push(user);
        });
    });
    return router;
}