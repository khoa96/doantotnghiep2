
$(document).ready(function () {

   // lang nge server tra ve.
   socket.on('server-respone-user-leave-group-to-client', function(data) {
	   $(".list-message-history").find("#" + data.group).hide('slow')
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