let oldUrl = "";
let currentUrl = "";

function CreateDiv() {
    let div = document.createElement("div");
    div.style.width = "100vw";
    div.style.height = "3rem";
    div.innerHTML = "This domain probably is malicious!";
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.zIndex = "99999";
    div.style.backgroundColor = "#ff0000";
    div.style.fontWeight = "900";
    div.style.textAlign = "center";
    div.style.paddingTop = "auto";
    div.style.paddingBottom = "auto";
    div.style.fontSize = "2em";
    document.body.appendChild(div);
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}
function json(response) {
    return response.json()
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            currentUrl = new URL(tabs[0].url);
            if (oldUrl === "" || oldUrl.href !== currentUrl.href) {
                oldUrl = currentUrl;
                let data = JSON.stringify({"domain": currentUrl.href});
                console.log(data);
                fetch('http://localhost:5000',
                    {
                        'method': "POST",
                        "content-type": "application/json;charset=utf-8",
                        body: data
                    })
                    .then(status)
                    .then(json)
                    .then((data) => {
                        console.log(data)
                        if (data["sus"] === "bad") {
                            chrome.scripting.executeScript({
                                target: {tabId: tab.id},
                                function: CreateDiv
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        });
}});
