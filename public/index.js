var stopSpinner = false;
var animInterval;
var hourglassDisable = false;

$(document).ready(() => {
    console.log('Hello creep-show!');

    $('#hourglass').bind('click', function(e) {
        if(hourglassDisable)
            return;

        hourglassDisable = true;
        startSppiner($(this), () => {
            var $hourglassTitle = $('.hourglass-wrapper h2')
            $hourglassTitle.eq(0).hide();
            $hourglassTitle.eq(1).text('(01:59)').show();
            startTimer(118, '#hgTimer', () => {
                $hourglassTitle.eq(0).show();
                $hourglassTitle.eq(1).hide();
                hourglassDisable = false;
            });
        });

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
            }
        });
    });
});

var startSppiner = ($spinner, callback) => {
    $spinner.addClass('hourglass-animate');
    stopSpinner = false;
    animInterval = setInterval(() => {
        console.log('=> sppiner interval()');
        if(stopSpinner) {
            $spinner.removeClass('hourglass-animate');
            clearInterval(animInterval);
            if(callback)
                callback();
        }
    }, 1600);
};

function startTimer(duration, selector, callback) {
    var display = document.querySelector(selector);
    var startTime = parseInt(Date.now() / 1000, 10);
    console.log(startTime);

    var timer, minutes, seconds;
    var timerInterval = setInterval(function () {
        timer = startTime + duration - parseInt(Date.now() / 1000, 10);
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = `(${minutes}:${seconds})`;

        if (timer < 0) {
            clearInterval(timerInterval);
            if(callback)
                callback();
        }
    }, 1000);
}