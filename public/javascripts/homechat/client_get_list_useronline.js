
$(document).ready(function () {
	// lang nghe su kien server tra ve client vua moi login.
	socket.on ('server-broadcast-user-online-to-client',function (data) {
		//them user vua dang nhap vao list user online
			var user =  ' <div class="row user-chat-body" id="'+data._id+'"> ';
			user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar"> ';
			user += ' <div class="user-chat-avatar-icon"> ';
			user += ' <img src="./uploads/'+ data.avatar +'"> ';
			user += ' </div> ';
			user += ' </div> ';
			user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
			user += ' <div class="row">';
			user += ' <div class="col-sm-8 col-xs-8 user-chat-name">';
			user += ' <span class="user-chat-name-meta">'+data.username+'</span> ';
			user += ' </div>';
			user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
			user += ' <span class="time-meta pull-right "><span class="user-state"></span></span> ';
			user += ' </div> ';
			user += ' </div> ';
			user += ' </div> ';
			user += ' </div> ';
			$(".list-user-online").append(user);
	});
});