document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#submit').addEventListener('click', onclick, false)

    function onclick() {
        var data = document.getElementById("content").value;
        fetch("/addRoom", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: data }),
        })
            //  console.log('hi')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
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
                window.location.pathname = '/party'
            })
            .catch((err) => {
                console.log(err);
            });

        
    }
}, false)

// console.log("hlo madafaka");
