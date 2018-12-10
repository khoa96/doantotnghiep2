$(document).ready(function () {
	// ham nay co chuc nang ==> gui user tu client luu den server
	var id_send = $(".side .side-one .heading .heading-avatar .heading-avatar-icon").attr('id');
    socket.emit('client-send-info-to-server',id_send);
});