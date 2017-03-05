//bg.js
chrome.runtime.onMessage.addListener(function(message, sender) {
    debugger;
    if (message.sendBack) {
        chrome.tabs.sendMessage(sender.tab.id, message.data);
    }
});