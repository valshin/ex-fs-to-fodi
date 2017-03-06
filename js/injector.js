//injector.js
function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript( chrome.extension.getURL('js/proxy.js'), 'body');
//injectScript( chrome.extension.getURL('js/worm.js'), 'body');
//injectScript('https://code.jquery.com/jquery-1.11.1.js', 'body');


