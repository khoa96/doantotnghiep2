$(document).ready(function () {
	// tim kiem user online theo ten .
	$("#searchText").keyup(function () {
        var filter = $(this).val();
        $(".list-message-history .sideBar-body .sideBar-main .sideBar-name p.name-meta").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).parent().parent().parent().parent().hide(1000);
            } else {
                $(this).parent().parent().parent().parent().show(1000);
                
            }
        });
    });
});