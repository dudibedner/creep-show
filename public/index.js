$(document).ready(() => {
    console.log('Hello creep-show!');

    $('#hourglass').bind('click', function(e) {
        var $spinner = $(this);
        $spinner.addClass('hourglass-animate');
        $.ajax({
            type: 'POST',
            url: '/all',
            cache: false,
            success: function(res) {
                console.log(res);
                $('#currentBtcPrice').text(res[0]);
                $('#currentLtcPrice').text(res[1]);
            },
            error: function(xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
            },
            complete: function(e) {
                $spinner.removeClass('hourglass-animate');
            }
        });
    });
    
});