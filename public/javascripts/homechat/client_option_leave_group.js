
$(document).ready(function () {

   // lang nge server tra ve.
   socket.on('server-respone-user-leave-group-to-client', function(data) {
	   $(".list-message-history").find("#" + data.group).hide('slow');
	   // thay doi lai giao dien chat chinh( thanh header va box main chat).
	   var heading = '';
		     heading += ' <div class="col-sm-2 col-md-1 col-xs-3 heading-avatar"> ';
			 heading += ' <div class="heading-avatar-icon heading-avatar-icon-recipient" id=""> ';
			 heading += ' <img src="./images/avatar6.png"> ';
			 heading  += ' </div> ';
			 heading +='  </div> ';
		 	 heading += '  <div class="col-sm-8 col-xs-7 heading-name"> ';
			 heading += '<a class="heading-name-meta">Username </a> ';
			 heading += '<span class="heading-online">Online</span> ';
			 heading += ' </div> ';
		$(".conversation .heading").html(heading);

		var message = '';
		    message += ' <div class="row message-previous" > ';
			message += '<div class="row message-previous" >';
			message += '<div class="col-sm-12 previous">';
			message += '<a href="#" id="btn-click-load-pre-message"> Show Previous Message!</a>';
			message += '</div>';
		    message += '</div>';

		    message += '<div class="row list-message" style="margin-top: 20px;">';
			message += '<img src="./images/background_chat.jpg" style="display: block;width: 50%;height: 70%;margin: 50px auto;">';
			message += '</div>';
		$(".conversation .message").html(message);
   })

	// su kien 1 thanh vien trong nhom roi di..
	$(document).on('click', '.click-out-group', function(){
		//id cua group.
		var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		// ten cua nguoi roi di
		var creatorName = $(".side .side-one .heading .heading-username p").text();
		// id cua nguoi roi di.
		var creatorId =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
		var arrUserIds = [];
		var userOfGroup = $(document).find(".list-user-in-group .user-of-group");
	     userOfGroup.each(function() {
			var userId = $(this).attr('id');
			if(userId != creatorId){
				arrUserIds.push(userId)
			}
		 });

		 var message = {
			idCreator: creatorId,
			body: creatorName + ' đã rời khỏi nhóm. ',
			group: groupId,
			time: new Date(),
			type: 'notification'
		 }
		 
		 // luu tin nhan vao trong CSDL.
		 socket.emit('client-send-group-message-to-server', message);
        //emit len phia serer de cap nhat lai nhom
		 socket.emit('client-leave-group', {group: groupId, arrUserIds: arrUserIds})
	})
});