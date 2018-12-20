$(document).ready(function () {
    
    $("#btn-click-notification").click(function() {
        $(".side-two").css({
            "left": "0"
        });
    });

    $(".newMessage-back").click(function() {
        $(".side-two").css({
            "left": "-100%"
        });
    });
    $("#btn-click-notification").click(function(){
        var count_notification = $(this).find('.notification-count');
        count_notification.text("");
    });
});