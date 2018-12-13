$(document).ready(function () {
	//  xu ly cac option khac cua group.
	
	// 1. lang nghe server tra ve cac user co trong group.
	socket.on('server-response-all-user-in-group-to-client', function(data){
		var users  = data.members;
		$("#people .list-user-in-group").html("");
		for(var i = 0; i < users.length; i++){
			if(users[i].state == 'off') {
				var user = ' <li > ';
					user += ' <div class="row user-of-group" id="'+ users[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ users[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta">'+ users[i].username +'</span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </li> ';
		
				$("#people .list-user-in-group").append(user);
			} else {
				var user = ' <li> ';
					user += ' <div class="row user-of-group" id="'+ users[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ users[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta">'+ users[i].username +'</span> ';
					user += ' </div> ';
					user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
					user += ' <span class="time-meta pull-right "><span class="user-state" style="margin-top:10px" ></span></span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += '</li>';
			    $("#people .list-user-in-group").append(user);
			}

		}
	});

	// 2 . lang nghe su kien them nguoi dung.
	  // 2.1: ket qua tim kiem user theo ten.
	  socket.on('server-respone-search-user-to-client', function(data) {
		  $(document).find(".result-search-user").html("");
		  for (var i = 0; i < data.length; i++) {
			  if(data[i].state == 'off') {
				var user = ' ';
					user += ' <div class="row user-chat-body user-add-to-group" id="'+ data[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ data[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta" style="font-size: 14px">'+ data[i].username +'</span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';

			    $(document).find(".result-search-user").append(user);

			  } else {
				var user = ' ';
					user += ' <div class="row user-chat-body user-add-to-group" id="'+ data[i]._id +'" > ';
					user += ' <div class="col-sm-3 col-xs-3 user-chat-avatar">';
					user += ' <div class="user-chat-avatar-icon"> ';
					user += ' <img src="./uploads/'+ data[i].avatar +'"> '
					user += ' </div> ';
					user += ' </div> ';
					user += ' <div class="col-sm-9 col-xs-9 user-chat-main"> ';
					user += ' <div class="row"> ';
					user += ' <div class="col-sm-8 col-xs-8 user-chat-name"> ';
					user += ' <span class="user-chat-name-meta" style="font-size: 14px">'+ data[i].username +'</span> ';
					user += ' </div> ';
					user += ' <div class="col-sm-4 col-xs-4 pull-right "> ';
					user += ' <span class="time-meta pull-right "><span class="user-state" style="margin-top:10px" ></span></span> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
					user += ' </div> ';
				
		        $(document).find(".result-search-user").append(user);
			}
		  }
	  })
	

	//1 . load tat ca nguoi dung. do len option.
	$(document).on('click', "#option-group-chat", function(){
        var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
        socket.emit('client-request-get-all-user-in-group-to-server', group_id );
	});
	
	// 2. them user vao trong group.
	 // 2.1 : tim kiem  nguoi dung de them vao nhom
		$(document).on('keyup', '.box-search-user-in-group', function(){
			var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
			var username = $(this).text();
	     	socket.emit('search-user-add-to-group', {groupId: group_id, username: username});
		});
});