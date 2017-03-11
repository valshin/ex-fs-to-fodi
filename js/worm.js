(($) => {
    let btnTpl = `<div 
id="kodi_play_btn" 
style="width: 40px; height: 40px; background-color: red; z-index: 1000; position: absolute; cursor: pointer">PLAY</div>`;
    let btn = $(btnTpl);
    btn.on('click', e => {
        window.MXoverrollCallback && window.MXoverrollCallback();
    });
    $('#MToverroll').append(btn);
})(window.$);


