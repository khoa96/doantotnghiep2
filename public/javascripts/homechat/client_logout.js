
$(document).ready(function () {
	
	// client lang nghe server tra ve su  kien cac client da logout.

	socket.on('server-broadcast-user-logout-to-client',function(data){
		$(".list-user-online").find("#"+data).hide('slow');
	});

	//client kich hoat su kien logout
	$("#btn-click-logout").click(function() {
		var user_id = $(".heading-avatar .heading-avatar-icon").attr('id');
        socket.emit('client-logout', user_id);
	});
});