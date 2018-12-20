$(document).ready(function () {
	//  su kien khi nguoi dung click : tao group chat.
	//Tao giao dien tao group chat.
	$("#btn-click-chat-group").click(function(){
		$(".conversation .message").html("");
		var heading = '  <div class="input-search-chat-group"> ';
			heading += ' <div class="col-sm-1 col-md-1 col-xs-1" style="border:1px solid lightgray"> ';
			heading += ' <span>Đến:</span> ';
			heading += ' </div> ';
			heading += ' <div class="col-sm-9 col-md-9 col-xs-9" style="position: relative"> ';
			heading += ' <div  class="editable box-search-user-group"> ';
			heading += ' <div  contentEditable=true class="col-sm-3 col-md-3 col-xs-3 left editable" data-placeholder="username" style="border-right: 1px solid lightgrey;"></div> ';
			heading += ' <div  contentEditable=true class="col-sm-9 col-md-9 col-xs-9 right editable"></div> '
			heading += ' </div> ';
			heading += ' </div> ';
			heading += ' <div class="col-sm-2 col-md-2 col-xs-2"> ';
			heading += ' <button  type="button" class="btn btn-primary btn-xs" id="btn-click-create-group">Create Group</button> ';
			heading += ' </div> ';
			heading += ' <div class="search-result-user-group" style="display: none"> ';
			heading += ' <div class="heading"> ';
			heading += ' <p>Liên hệ</p> ';
			heading += ' </div> ';
			heading += ' <div class="body list-user-result"> ';
			heading +=  ' </div>';
			heading += ' </div> ';
			heading += ' </div> ';
			heading += ' </div> ';
 
		 $(".conversation .heading").html(heading);
	 });

	  //placeholder Attribute for an Editable div
	  $(document).on('change keydown keypress input', 'div[data-placeholder]', function() {
        if (this.textContent) {
            this.dataset.divPlaceholderContent = 'true';
        }
        else {
            delete(this.dataset.divPlaceholderContent);
        }
	});
	
	// khi click vao ket qua tim kiem thi se them user vao o chua cac thanh vien trong nhoms
	//click each item in result list search. ( them vao nhom chua co)
    $(document).on('click','.user-search',function(){
        var username = $(this).find(".sideBar-main .name-meta").text();
        var id = $(this).attr('id');
        var avatar = $(this).find(".sideBar-avatar .avatar-icon img").attr('src');
        $(".box-search-user-group .right").append('<span class="label label-warning" contenteditable="false" id="'+id+'" data-avatar="'+avatar+'">'+username+'</span>').focusin();
        $(".box-search-user-group .left").text("");
	});

	// bieu tuong cam xuc.
	 $("#comment").emojioneArea({
        pickerPosition: "top",
        hidePickerOnBlur: true,
        searchPlaceholder: "tìm kiếm",
        autocomplete: false
    });
	
});