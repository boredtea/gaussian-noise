document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').addEventListener('click', onclick, false)

    function onclick() {
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            let msg = {
                txt: "start"
            }
            //chrome.tabs.create({active: true, url: "https://gaussian-noise.herokuapp.com/"});
            chrome.windows.create({
                tabId: tabs[0].id,
                type: 'popup',
                focused: true,
                // incognito, top, left, ...
                url: "https://gaussian-noise.herokuapp.com/choose"
            });

            chrome.tabs.sendMessage(tabs[0].id, msg)
        })
    }
}, false)