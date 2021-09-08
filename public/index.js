var stopSpinner = false;
var animInterval;

$(document).ready(() => {
    console.log('Hello creep-show!');

    $('#hourglass').bind('click', function(e) {
        startSppiner($(this));

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
                stopSpinner = true;
                //$spinner.removeClass('hourglass-animate');
            }
        });
    });
});

var startSppiner = ($spinner) => {
    $spinner.addClass('hourglass-animate');
    stopSpinner = false;
    animInterval = setInterval(() => {
        console.log('=> sppiner interval()');
        if(stopSpinner) {
            $spinner.removeClass('hourglass-animate');
            clearInterval(animInterval);
        }
    }, 1600);
};