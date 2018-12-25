$(document).ready(function () {

	///------------------FUNCTION------------=
	function formatDate(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
	}

	// ham tim tim tin nhan theo group id.
	function getMessageByGroupId (arrLastMessage, groupId) {
	   for(var i = 0 ; i < arrLastMessage.length; i++) {
		   if(arrLastMessage[i].group == groupId){
			   return arrLastMessage[i].body;
		   }
	   }
	}
	//-----------------END FUCNTION----------------
	// 1.client lang nghe server tra ve tat ca  nhom ma 1 user tham gia.
	socket.on('server-send-all-group-to-client', function(data) {
	   //  data la 1 mang cac group ma user da tham gia.
	   var rooms = data.rooms;
	   var arrLastMessage = data.arrLastMessage;
	   console.log(arrLastMessage)
	   
	   for(var i = 0; i < rooms.length; i++) {
		   if(rooms[i].type == 'group') {
			   // group room chat.
			   var group = ' <div class="row sideBar-body" id="'+ rooms[i]._id+'" >';
				group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
				group += ' <div class="avatar-icon">';
				group += ' <img src="'+ rooms[i].avatar_group +'">';
				group += ' </div>';
				group += ' </div> ';
				group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
				group += ' <div class="row"> ';
				group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
				group += ' <p class="name-meta" ><strong>'+ rooms[i].name +'</strong></p>';
				group += ' <p class="message-history">'+ getMessageByGroupId(arrLastMessage, rooms[i]._id) +'</p>';
				group += ' </div>';
				group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
				group += ' <span class="time-meta pull-right"></span>';
				group += ' </div>';
				group += ' </div>';
				group += ' </div>';
				group += ' </div>';

				$(".list-message-history").append(group);

		   } else {
			   // chat private.
			var id_creator_group = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
	        if(rooms[i].id_creator_group == id_creator_group) {
		
				var group = ' <div class="row sideBar-body" id="'+ rooms[i]._id+'" data-recepient="'+rooms[i].id_recepient+'" > ';
					group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
					group += ' <div class="avatar-icon">';
					group += ' <img src="'+ rooms[i].avatar_recepient +'">';
					group += ' </div>';
					group += ' </div> ';
					group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
					group += ' <div class="row"> ';
					group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
					group += ' <p class="name-meta" ><strong>'+ rooms[i].username_recepient+'</strong></p>';
					group += ' <p class="message-history">last message</p></p>';
					group += ' </div>';
					group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
					group += ' <span class="time-meta pull-right"></span>';
					group += ' </div>';
					group += ' </div>';
					group += ' </div>';
					group += ' </div>';

					$(".list-message-history").append(group);

			} else {
		
				var group = ' <div class="row sideBar-body" id="'+ rooms[i]._id +'" data-recepient="'+rooms[i].id_creator_group+'">';
					group += ' <div class="col-sm-3 col-xs-3 sideBar-avatar"> ';
					group += ' <div class="avatar-icon">';
					group += ' <img src="'+ rooms[i].avatar_send +'">';
					group += ' </div>';
					group += ' </div> ';
					group += ' <div class="col-sm-9 col-xs-9 sideBar-main">';
					group += ' <div class="row"> ';
					group += ' <div class="col-sm-8 col-xs-8 sideBar-name">';
					group += ' <p class="name-meta" ><strong>'+ rooms[i].username_send +'</strong></p>';
					group += ' <p class="message-history">last message</p>';
					group += ' </div>';
					group += ' <div class="col-sm-4 col-xs-4 pull-right sideBar-time"> ';
					group += ' <span class="time-meta pull-right"></span>';
					group += ' </div>';
					group += ' </div>';
					group += ' </div>';
					group += ' </div>';
					$(".list-message-history").append(group);
			}
		}
	}
	})
	
	// 2. lan nghe server tra ve tat ca user online.
	socket.on('server-respone-user-online-to-client', function(data) {
		for(var i = 0; i < data.length; i++) {
			var user =  ' <div class="row user-chat-body" id="'+data[i]._id+'"> ';
				user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar"> ';
				user += ' <div class="user-chat-avatar-icon"> ';
				user += ' <img src="./uploads/'+ data[i].avatar +'"> ';
				user += ' </div> ';
				user += ' </div> ';
				user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
				user += ' <div class="row">';
				user += ' <div class="col-sm-8 col-xs-8 user-chat-name">';
				user += ' <span class="user-chat-name-meta">'+data[i].username+'</span> ';
				user += ' </div>';
				user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
				user += ' <span class="time-meta pull-right "><span class="user-state"></span></span> ';
				user += ' </div> ';
				user += ' </div> ';
				user += ' </div> ';
				user += ' </div> ';
				$(".list-user-online").append(user);

		}
	})
	// ham nay co chuc nang ==> gui user tu client luu den server
	var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
	// dang ki thong tin socket voi server
	socket.emit('client-send-info-to-server',id_send);
	
	// load toan bo cuoc noi chuyen cua user.
	socket.emit('client-requesr-get-all-group-to-server', id_send);

	// load toan bo user trong server.
	socket.emit('client-request-get-all-user-online-to-server', id_send)
});