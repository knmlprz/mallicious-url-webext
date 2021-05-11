var oldUrl = "";
var currentUrl = "";
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.url) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            currentUrl = new URL(tabs[0].url);
            if(oldUrl === "" || oldUrl.host !== currentUrl.host) {
                oldUrl = currentUrl;
            }
        });
    }
});
