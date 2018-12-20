$(document).ready(function () {
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

	// lang nghe tra ve previous message cua server.
	socket.on('server-send-previous-message-group-to-client', function(data){
		// du lieu tra ve la 1 mang cac message. voi moi message da dc join voi 1 user tuong ung.
		var creator =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
		var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		for( var i = 0; i < data.length; i++) {
		   if(data[i].type == 'text'){
			   // neu la tin nhan dang text.
			   if(creator == data[i].creator._id) {
				   // neu la tin nhan cua user
				   var message  = ' <div class="row message-body"> ';
					  message += ' <div class="col-sm-12 message-main-sender"> ';
					  message += ' <div class="sender"> ';
					  message += ' <div class="message-text">'+ data[i].body +' </div>';
					  message += ' <span class="message-time pull-right">'+ formatDate(new Date(data[i].time)) +'</span> ';
					  message += ' </div> ';
					  message += ' </div> ';
					  message += ' </div> ';
					  $(".list-message").prepend(message);
   
			   } else {
				   // neu kola tin nhan cua user.
				   var message = ' <div class="row message-body"> ';
				   message += ' <div class="col-sm-12 message-main-receiver"> ';
				   message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
				   message += '  <img src="./uploads/'+ data[i].creator.avatar +'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="top" title="'+ data[i].creator.username +'"> ';
				   message += ' </div>';
				   message += ' <div class="right" style="width: 90%;float: left;">';
				   message += ' <div class="receiver">';
				   message += ' <div class="message-text" >'+ data[i].body +'</div> ';
				   message += ' <span class="message-time pull-right">'+ formatDate(new Date(data[i].time)) +'</span>';
			   
				   message += ' </div> ';
				   message += ' </div> ';
				   message += ' </div> ';
				   message += ' </div> ';
				   $('.list-message').prepend(message);
	  
			   }
		   
   
		   } else if (data[i].type == 'notification') {
			   var group_notification = '  <div class="change-group-notification" style="text-align: center;margin-top: 10px;margin-bottom: 20px;height: 40px;"> ';
			   group_notification += ' <p class="time-change">'+ formatDate(new Date(data[i].time)) +'</p> ';
			   group_notification += ' <p class="content-notification"> ';
			   group_notification += ' <span class="content"><strong>'+ data[i].body +' </span> ';
			   group_notification += ' </p> ';
			   group_notification += ' </div> ';
		   
			   // insert notification to list message
			   $(".list-message").prepend(group_notification);
			   
			   
		   } else {
			   if(creator == data[i].creator._id ){
				   // thêm tin nhắn vào phía người gui
				   var message  = ' <div class="row message-body"> ';
					   message += ' <div class="col-sm-12 message-main-sender" style="margin-bottom:20px"> ';
					   message += ' <div class="sender"  style="background-color: white" > ';
					   message += ' <div class="message-text"> <img src="./uploads/'+data[i].body+'" class="image-message zoomable"/></div>';
					   message += ' <span class="message-time pull-right" style="color: #333">'+ formatDate(new Date(data[i].time)) +'</span> ';
					   message += ' </div> ';
					   message += ' </div> ';
					   message += ' </div> ';
					   $(".list-message").prepend(message);
					   
					   $(document).find(".list-message-history").find('#'+ data.group).find(".message-history").html('<strong>Bạn:'+data.body+'</strong>');
					   $(document).find(".list-message-history").find('#'+ data.group).find(".time-meta").html('<strong>'+ formatDate(new Date(data.time)) +'</strong>');
		   
				   
					   $(".sender").css('background-color', data.color)
			   } else {
				   // nếu tin nhắn ko phải của mình gui đi.
				   var message = ' <div class="row message-body"> ';
					   message += ' <div class="col-sm-12 message-main-receiver" style="margin-bottom:20px"> ';
					   message += ' <div class="left" style="width: 10%;float: left;margin-top: 10px"> ';
					   message += '  <img src="./uploads/'+ data[i].creator.avatar +'" style="display: block;with:40px;height: 40px;border-radius: 50%;margin-top: 15px" data-toggle="tooltip" data-placement="left" title="'+data.username_recipient+'"> ';
					   message += ' </div>';
					   message += ' <div class="right" style="width: 90%;float: left;">';
					   message += ' <div class="receiver">';
					   message += ' <div class="message-text" ><img src="./uploads/'+data[i].body+'" class="image-message zoomable"/></div> ';
					   message += ' <span class="message-time pull-right">'+ formatDate(new Date(data[i].time)) +'</span>';
					   message += ' </div> ';
					   message += ' </div> ';
					   message += ' </div> ';
					   message += ' </div> ';
		   
				   $('.list-message').prepend(message);
				   $(document).find(".list-message-history").find('#'+ data.group).find(".message-history").html('<strong>'+ data.userCreatdor+ ': ' + data.body+'</strong>');
				   $(document).find(".list-message-history").find('#'+ data.group).find(".time-meta").html('<strong>'+ formatDate(new Date(data.time)) +'</strong>');
		   
				   
			   }
		   }
		}
	   socket.emit('client-request-get-color-of-group', groupId);
   
   });
	// load previous message 
	$(document).on('click', '#btn-click-load-pre-message', function(){
		var group = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		var list_message = $(".list-message .message-body");
		var list_notification = $(".list-message .change-group-notification");
		var sum_message = list_message.length + list_notification.length;
		if(group != ''){
			socket.emit('client-request-load-previous-message', {sum_message: sum_message, group: group})
		}
	});
});