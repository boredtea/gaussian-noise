document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#submit').addEventListener('click', onclick, false)

    function onclick() {
        var data = document.getElementById("content").value;
        var room_url = "https://gaussian-noise.herokuapp.com/party" + data;
        fetch("/addRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: data }),
        })
            .then((res) => res.json())
            .then(() => {
                // console.log(data);
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                    let msg = {
                        txt: "start"
                    }
                    chrome.windows.create({
                        tabId: tabs[0].id,
                        type: 'popup',
                        focused: true,
                        // incognito, top, left, ...
                        url: room_url
                    });

                    chrome.tabs.sendMessage(tabs[0].id, msg)
                })
                window.location.pathname = `/party/${data}`
            })
            .catch((err) => {
                console.log(err);
            });
    }
}, false)
