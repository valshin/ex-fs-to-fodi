var checkContext = function (elem) {
    debugger;
    if (elem.includes('manifest_m3u8')){
        var r = new RegExp('src="(.*)">');
        var src = r.exec(elem)[1];
        $.ajax({
            url: src,
            success: function (data) {
                var r2 = new RegExp("hls: '(.*)'.replace");
                var src2 = r2.exec(data)[1].replace(/\&amp\;/g, '&');
                debugger;
                $.ajax({
                    url: src2,
                    success: function (data) {
                        //TODO: data there!!!
                        debugger;
                    }
                });
            }
        });
        return true;
    }
    return false;
};

var stored = jQuery.fn.append;

jQuery.fn.extend({
    append: function () {
        var res = checkContext(arguments[0]);
        if (res) return;
        var self = this;
        return stored.apply(self, arguments);
    }
});
//
// jQuery.fn.extend({
//

//
// });