chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        localStorage.setItem("placeHolder", JSON.stringify(request.dummy));
    }
)