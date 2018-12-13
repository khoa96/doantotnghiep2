$(document).ready(function(){

    // click heading group chat
    $(document).on('click', '#option-group-chat', function(){
        var item = $(document).find(".box-option");
        if(item.hasClass('hidden-box-option-group')){
            item.removeClass('hidden-box-option-group').addClass('show-box-option-group');
        }else{
            item.removeClass('show-box-option-group').addClass('hidden-box-option-group');
        }

    });

    // hiển thị modal : change color box chat
    $(document).on('click', '.click-change-color', function(){
        $("#modal-change-color").modal('show').removeClass('zoomOut');
    });

    $(document).on('click', '#btn-click-hide-modal-change-color', function(){
        $("#modal-change-color").toggleClass('zoomOut');
    });

    // model change name member
    $(document).on('click', '#btn-click-hide-modal-change-name-member', function(){

        $("#modal-change-name-member").toggleClass('zoomOut');
    });

    $(document).on('click', '#btn-click-hide-sub-modal-change-name-member', function(){
        $("#sub-modal-change-name-member").toggleClass('zoomOut');
    });

    // modal change name group
    $(document).on('click', '.change-name-group', function () {
        $("#modal-change-name-group").modal('show').removeClass('zoomOut');
    });

    $(document).on('click', '#btn-click-hide-modal-change-name-group', function(){
        $("#sub-modal-change-name-member").toggleClass('zoomOut');
    });

    // modal add user
    $(document).on('click', '.click-add-user', function(){
        $("#modal-add-user-to-group").modal('show').removeClass('zoomOut');
    });

    $(document).on('click', '#btn-click-hide-modal-add-user-to-group', function(){
        $("#modal-add-user-to-group").toggleClass('zoomOut');
    });
    $(document).on('click', '.user', function () {
        var id = $(this).attr('id');
        var avatar = $(this).find('.avatar img').attr('src');
        var username =  $(this).find('.name').text();

        var user_lable = '<span class="label label-warning" contenteditable="false" id="'+id+'" data-avatar="'+avatar+'">'+username+'</span>';
        (".box-search-user-in-group").removeAttr('data-placeholder').prepend(user_lable);
     });
   
});