$(document).ready(function () {
	// xu ly  su kien nguoi  dung thay doi thong tin ca nhan

	$(document).find("#fileUpload").on('change', function (e1) {

        if (typeof (FileReader) != "undefined") {

            var image_holder = $(document).find("#modal-change-info .image-holder");
            image_holder.empty();

            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image avatar-change"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);

            // cap nhat thong tin.
            
        } else {
            alert("This browser does not support FileReader.");
        }
    });

   
});