var sendPlaylist = function (playlist) {
    debugger;
}

var checkContext = function (elem) {
    var root = this;
    if (elem.includes && elem.includes('manifest_m3u8')) {
        var iframe = $(elem);
        root.append(iframe);
        iframe.on('load', function () {
            var fn = (function () {
                var iid = setInterval(function () {
                    if (!links.hls) {
                        return;
                    }
                    clearInterval(iid);
                    debugger;
                    $.ajax({
                        url: links.hls,
                        success: function (data) {
                            debugger;
                            var hdUrlRegEx = /BANDWIDTH.*\n(http.*\.m3u8)/;
                            var hdUrl = hdUrlRegEx.exec(data)[1];
                            debugger;
                            $.ajax({
                                type: 'POST',
                                url: 'http://192.168.0.107:8100/play',
                                data: JSON.stringify({
                                    "jsonrpc": "2.0",
                                    "method": "Playlist.Add",
                                    "params": {
                                        "playlistid": 1,
                                        "item": {"file": hdUrl}
                                    },
                                    "id": 1
                                }), // or JSON.stringify ({name: 'jonas'}),
                                success: function (data) {
                                    debugger
                                },
                                contentType: "application/json",
                                dataType: 'json'
                            });
                            // $.ajax({
                            //     type: 'POST',
                            //     url: 'http://192.168.0.107:8100/play',
                            //     // url: 'http://anonymous@192.168.0.105:8100/jsonrpc',
                            //     success: function (response) {
                            //         debugger;
                            //     },
                            //     contentType: "application/json",
                            //     data: {
                            //         "jsonrpc": "2.0",
                            //         "method": "Playlist.Add",
                            //         "params": {
                            //             "playlistid": 1,
                            //             "item": {"file": hdUrl}
                            //         },
                            //         "id": 1
                            //     },
                            //     dataType: 'json',
                            //     timeout: 5000,
                            //     username: 'anonymous',
                            //     password: '',
                            //     error: function (jqXHR, textStatus, erroThrown) {
                            //         debugger;
                            //     },
                            //     beforeSend: function (xhr, settings) {
                            //         xhr.mozBackgroundRequest = true;
                            //     }
                            // });
                            // $('html').append('<div id="playlist">' + data + '</div>');
                            console.info(data);
                        },
                        error: function (data) {
                            debugger;
                        }
                    });
                }, 50);

            }).toString();
            iframe[0].contentWindow.eval('(' + fn + ')()');
        });
        var intervalId = setInterval(function () {
            var playlist = $('#playlist');
            if (playlist.text().length) {
                debugger;
                clearInterval(intervalId);
                sendPlaylist(playlist);
            }
        }, 50);
        return true;
    }
    return false;
};

var stored = jQuery.fn.append;

jQuery.fn.extend({
    append: function () {
        var self = this;
        var res = checkContext.apply(self, arguments);
        if (res) return;
        return stored.apply(self, arguments);
    }
});
