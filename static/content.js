chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.txt === "start") {

        //sending student and course information to background.js
        chrome.runtime.sendMessage({
            dummy: "dummyText",
        });
    }
});