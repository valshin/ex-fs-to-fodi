var f = function () {
    var scriptText = [].slice.call(document.querySelectorAll('script[type="text/javascript"]'))
        .filter(f => f.innerHTML.includes('request_host_id'))[0];
    eval(scriptText.innerHTML);
    console.log(request_host_id);
    debugger;
    $.post(window_surl, banners_script_clickunder).success(function(video_url) {
        debugger;
        player_hls(video_url.mans.manifest_m3u8);
    });

};

const handler = function () {
    this.kodiId = Math.floor(Math.random() * 1000000);
    const data = {
        scope: this,
        MXoverrollCallback: this.MXoverrollCallback
    };
    f();
    //data.MXoverrollCallback && data.MXoverrollCallback.call(data.scope);
    // chrome.runtime.sendMessage(this.kodiId, {data: data}, function () {
    //     debugger;
    // });
    console.log(window.MXoverrollCallback);
}.bind(window);
setTimeout(handler, 0);