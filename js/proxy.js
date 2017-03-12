(() => {
    const worm = (() => {

        class Logger {
            constructor() {
                this._prefix = 'EX-FS to KODI:';
            }

            getMsg() {
                return Array.prototype.slice.call(arguments).join(' ');
            }

            error() {
                console.error(this._prefix, this.getMsg.apply(this, arguments));
            }

            info() {
                console.info(this._prefix, this.getMsg.apply(this, arguments));
            }
        }

        class Worker {
            constructor(jQuery) {
                this._checkInterval = undefined;
                this._stopInterval = undefined;
                this._logger = new Logger();
                this._interval = 50;
                this.$ = jQuery;
            }

            onSendToKodiSuccess(data) {
                this._logger.info('Sent successfully');
            }

            sendToKodi(url) {
                this.$.ajax({
                    type: 'POST',
                    url: 'http://192.168.0.107:8100/play',
                    data: JSON.stringify({
                        "jsonrpc": "2.0",
                        "method": "Playlist.Add",
                        "params": {
                            "playlistid": 1,
                            "item": {"file": url}
                        },
                        "id": 1
                    }),
                    success: this.onSendToKodiSuccess.bind(this),
                    contentType: "application/json",
                    dataType: 'json'
                });
            }

            parsePlaylist(data) {
                this._logger.info('Found playlist:');
                this._logger.info(data);
                let resRegExp = /BANDWIDTH=.*\n(http.*\.m3u8)/gi;
                let qRegExp = /BANDWIDTH=(\d+).*\n(http.*\.m3u8)/i;
                let variants = data.match(resRegExp);
                variants = variants.map(variant => {
                    const res = qRegExp.exec(variant);
                    qRegExp.lastIndex = 0;
                    return {
                        quality: res[1],
                        url: res[2]
                    };
                });
                let best = variants.sort((a, b) => a.quality > b.quality)[0];
                if (!variants.length) {
                    this._logger.error('No url found');
                    return;
                }
                this._logger.info('Sending to play the best quality', best.quality, 'by url', best.url);
                return best.url;

            }

            playlistHandler(data) {
                let url = this.parsePlaylist(data);
                this.sendToKodi(url);
            }

            onPlaylistError() {
                this._logger.error('Playlist obtaining error');
            }

            playlistChecker() {
                if (!links || !links.hls) {
                    return;
                }
                clearInterval(this._checkInterval);
                this.stopVideo();
                this._logger.info("Playlist url found:");
                this._logger.info(links.hls);
                this.$.ajax({
                    url: links.hls,
                    success: this.playlistHandler.bind(this),
                    error: this.onPlaylistError.bind(this)
                });
            }

            doStop() {
                clearInterval(this._stopInterval);
                this.$('.fp-pause-icon').click();
            }

            checkStopButton() {
                return this.$('#player.is-ready').text().length;
            }

            tryStopVideo() {
                this.checkStopButton() && this.doStop();
            }

            stopVideo() {
                this._stopInterval = setInterval(this.tryStopVideo.bind(this), this._interval);
            }

            run() {
                this._checkInterval = setInterval(
                    this.playlistChecker.bind(this),
                    this._interval
                );
            }

        }
        let worker = new Worker($);
        worker.run();
    }).toString();

    class Injector {
        constructor(jQuery) {
            this.jQuery = jQuery;
        }

        affectJQuery() {
            const stored = this.jQuery.fn.append;
            const jQuery = this.jQuery;
            jQuery.fn.extend({
                append: function () {
                    const elem = arguments[0];
                    if (elem.includes && elem.includes('manifest_m3u8')) {
                        const iframe = jQuery(elem);
                        iframe.on('load', function () {
                            iframe[0].contentWindow.eval('(' + worm + ')()');
                        });
                        return this.append(iframe);
                    }
                    return stored.apply(this, arguments);
                }
            });
        }

        inject() {
            this.affectJQuery();
        }
    }

    const injector = new Injector($);
    injector.inject();

})();




