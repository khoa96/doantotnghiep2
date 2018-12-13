$(document).ready(function () {
	 //-------------------function
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
	 //------------------end function
	// client lang nghe phan hoi thay doi ten nhom cua server.
	socket.on('server-broadcast-change-name-group-to-group', function(data){

			var group_notification = '  <div class="change-group-notification" style="text-align: center;margin-top: 10px;margin-bottom: 20px;height: 40px;"> ';
			group_notification += ' <p class="time-change">'+ formatDate(new Date(data.time)) +'</p> ';
			group_notification += ' <p class="content-notification"> ';
			group_notification += ' <span class="content"><strong>'+ data.body +' </span> ';
			group_notification += ' </p> ';
			group_notification += ' </div> ';
		
			// insert notification to list message
			$(".list-message").append(group_notification);
			$("#conversation").animate({
				scrollTop : $('#conversation').get(0).scrollHeight
			});
		
			// change heading box group-chat.
			$(document).find(".conversation .heading-name .heading-name-meta").text(data.groupName);
		
			// change list  heading group message history
			$(document).find(".list-message-history").find("#"+data.group).find(".sideBar-name .name-meta strong").text(data.groupName);
	});
	// xu ly su kien phia nguoi dung thay doi ten cua nhom chat
	 // 6 .change name group
	 $(document).on('click', '#btn-click-change-name-group', function(){

        var group_id = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		var user_change  = $(".side .side-one .heading .heading-username p").text();
		var user_change_id =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
		var name_group = $("#txt-name-group").val();
	    if(group_id != '' && user_change != '' && name_group != ''){
			var message = {
				creator: user_change_id,
				body: user_change + ' đã thay đổi tên cuộc trò chuyện nhóm thành ' + name_group,
				time: new Date(),
				group: group_id,
				groupName: name_group,
				type: 'notification'
			}
			socket.emit('client-request-change-name-group-to-serve', message);
		} else {
			alert('Bạn chưa nhập tên nhóm')
		}

       
    });
});