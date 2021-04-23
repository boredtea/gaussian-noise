document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#submit').addEventListener('click', onclick, false)

    function onclick() {
        var data = document.getElementById("content").value;
        var room_url = "https://gaussian-noise.herokuapp.com/party?roomname=" + data;
        // var room_url = "http://localhost:5000/party?roomname=" + data;
        

        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            let msg = {
                txt: "start"
            }
            chrome.windows.create({
                tabId: tabs[0].id,
                type: 'popup',
                focused: true,
                url: room_url,
                
            });
            chrome.tabs.sendMessage(tabs[0].id, msg)
        })
    }
}, false)
