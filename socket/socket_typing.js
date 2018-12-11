
const express =  require('express');
const router = express.Router();
module.exports = function(io, arrUser) {

    io.on('connection', function(socket) { 
	   // lắng nghe su kien nguoi  dung bat dau go phim.
	   socket.on('client-focusin',function(data){
         socket.broadcast.in(socket.room).emit('server-broadcast-client-typing', data);
	   });
	   
	   // lang nghe su kien foucus out.
	   socket.on('client-focusout',function(){
          socket.broadcast.in(socket.room).emit('server-broadcast-client-not-typing');
        });
	  
    });

    return router;
}