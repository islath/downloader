var progress = {
    show: function (str, callback) {
        var psContainer = $('<div>').addClass('progress'),
            psInner = $('<div>').addClass('progress-inner'),
            psContent = $('<div>').addClass('progress-content'),
            psIcon = $('<i>').addClass('fa').addClass('fa-spin').addClass('fa-spinner'),
            psText = $('<span>');

        psText.html(str);
        $('body').append(psContainer);
        psContainer.append(psInner.append(psContent.append(psIcon).append(psText)));
        $('.progress').fadeIn(200, function () {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    },
    hide: function (callback) {
        $('.progress').fadeOut(200, function () {
            $(this).remove();
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    }
};

function msg (type, str, callback, time) {
    var t = 'msg-' + type,
        msgContainer = $('<div>').addClass('msg'),
        msgWrapper = $('<div>').addClass('msg-wrapper'),
        msgContent = $('<div>').addClass('msg-content');

    msgContainer.append(msgWrapper.append(msgContent));
    $('body').append(msgContainer);

    msgContainer.fadeIn(200).addClass(t);
    msgContent.html(str);
    setTimeout(function () {
        msgContainer.fadeOut(200, function () {
            msgContainer.remove();
        });
        if (callback && typeof callback === 'function') {
            callback();
        }
    }, time && typeof time === 'number' ? time : 2000);
}
