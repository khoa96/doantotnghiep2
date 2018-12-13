$(document).ready(function () {
	// xu kien nguoi dung thay doi mau sac cua cuoc tro chuyen.
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


	// client lang nghe server tra ve thong báo thay doi mau sac tu server.
	socket.on('server-broadcast-color-to-all-client-in-group', function(data){

		var group_notification = ' <div class="change-group-notification" style="text-align: center;height: 40px;margin-top: 10px;margin-bottom: 20px;"> ';
		group_notification += ' <p class="time-change">'+ formatDate(new Date(data.time))+'</p> ';
		group_notification += ' <p class="content-notification"> ';
		group_notification += ' <span class="user-change"><strong>'+ data.body +'</strong></span> ';
		group_notification += ' </p> ';
		group_notification += ' </div> ';
		$(document).find('.sender').css('background-color',data.color);
		$(".list-message").append(group_notification);
		$("#conversation").animate({
			scrollTop : $('#conversation').get(0).scrollHeight
		});
	});



	$(document).on('click', '.list-color .box', function(){
		var user_change_name = $(".side .side-one .heading .heading-username p").text();
		var user_change_id =  $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
        var groupId = $(".conversation .heading .heading-avatar .heading-avatar-icon-recipient").attr('id');
		var color = $(this).data('color');
		if(color != ''){
			var message = {
				creator: user_change_id,
				body: user_change_name + ' đã thay đổi màu sắc của cuộc trò chuyện.',
				time: new Date(),
				group: groupId,
			    color: color,
				type: 'notification'
			}
			console.log(message);
			socket.emit('client-change-color-group-to-server', message);
		} else {
			alert ("Bạn chưa chọn màu sắc");
		}
        
    });
});