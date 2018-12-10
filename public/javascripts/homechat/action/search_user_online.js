$(document).ready(function () {
	// tim kiem user online theo ten .
	$("#searchUser").keyup(function () {
        var filter = $(this).val();
        $(".list-user-online .user-chat-body .user-chat-main .user-chat-name-meta").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).parent().parent().parent().parent().hide(1000);
            } else {
                $(this).parent().parent().parent().parent().show(1000);
                
            }
        });
    });
});