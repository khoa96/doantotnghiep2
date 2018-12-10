
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
            console.log(arrUser);
            console.log('so socket co trong server: ' + arrUser.length)
        });
        
        // khi huy 1 socket ==> xoa socket trong mang arrUser
        socket.on('disconnect',function(){
            for(let i = 0; i < arrUser.length; i++) {
                if(arrUser[i].id_send == socket.id_send){
                    arrUser.splice(i,1);
                    break;
                }
            }
            console.log('so socket con lai = ' + arrUser.length);
        });
    });

    return router;
}