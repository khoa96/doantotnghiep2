
$(document).ready(function () {
	//ham quy doi thoi gian.
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

	//  xu ly su kien co thong bao khi khong o trong che do truc tuyen.
	socket.on('server-send-notification-to-client', function(data) {
		var count_notification = $(".notification-count").text();
		var id_recepient  = $(".conversation .heading .heading-avatar-icon-recipient").data('recepient');
	    // insert notification into list notification
		var notification = ' <div class="row sideBar-body" > ';
			notification += ' <div class="col-sm-2 col-xs-2 sideBar-avatar"> ';
			notification += '  <div class="avatar-icon"> ';
			notification += ' <img src="' + data.avatar_send + '" > ';
			notification += ' </div> ';
			notification += ' </div> ';
			notification += ' <div class="col-sm-10 col-xs-10 sideBar-main"> ';
			notification += '  <div class="row"> ';
			notification += '  <p class="name-meta" ><strong>'+ data.username_send + '</strong> đã gửi tin nhắn cho bạn</p> ';
			notification += ' <p class="message-history time-notification" >' + formatDate(new Date(data.time)) + '</p> ';
			notification += ' </div> ';
			notification += ' </div> ';
			notification += ' </div> ';
			notification += ' </div> ';
        console.log(id_recepient)
		if(id_recepient != data.id_send){
			if(count_notification == ""){
				$(".notification-count").text(1);
			}else{
				$(".notification-count").text(parseInt(count_notification) + 1);
			}
			$(".list-notification").prepend(notification);
		}

	})
});