const root = document.getElementById("root");
const usernameInput = document.getElementById("username");
const button = document.getElementById("join_leave");
const shareScreen = document.getElementById("share_screen");
const toggleChat = document.getElementById("toggle_chat");
const toggleMode = document.getElementById("toggle_mode");
const unmuteAudio = document.getElementById("unmute_audio");
const showVideo = document.getElementById("show_video");
const pollDiv = document.getElementById("poll_here");
const pollURL = document.getElementById("start_poll");
const container = document.getElementById("container");
const count = document.getElementById("count");
const chatScroll = document.getElementById("chat-scroll");
const chatContent = document.getElementById("chat-content");
const chatInput = document.getElementById("chat-input");
let connected = false;
let room;
let chat;
let conv;
let screenTrack;
let total_polls = 0;

// if(button.innerHTML == "Leave")
// {
//   console.log("reload");
//   button.onclick(setTimeout("location.reload(true);"));
// }

function addLocalVideo() {
  Twilio.Video.createLocalVideoTrack().then((track) => {
    let video = document.getElementById("local").firstChild;
    let trackElement = track.attach();
    trackElement.addEventListener("click", () => {
      zoomTrack(trackElement);
    });
    video.appendChild(trackElement);
  });
}

// Mute a singular HTML5 element
function muteMe(elem) {
  elem.muted = true;
  elem.pause();
}

// Try to mute all video and audio elements on the page
function mutePage() {
  var elems = document.querySelectorAll("video, audio");

  [].forEach.call(elems, function (elem) {
    muteMe(elem);
  });
}

// Unmute a singular HTML5 element
function unmuteMe(elem) {
  elem.muted = false;
  elem.play();
}

// Try to unmute all video and audio elements on the page
function unmmutePage() {
  var elems = document.querySelectorAll("video, audio");

  [].forEach.call(elems, function (elem) {
    unmuteMe(elem);
  });
}

function connectButtonHandler(event) {
  event.preventDefault();
  if (!connected) {
    let username = usernameInput.value;
    if (!username) {
      alert("Enter your name before connecting");
      return;
    }
    button.disabled = true;
    button.innerHTML = "Connecting...";
    connect(username)
      .then(() => {
        button.innerHTML = "Leave call";
        button.disabled = false;
        shareScreen.disabled = false;
        mutePage();
      })
      .catch(() => {
        alert("Connection failed. Is the backend running?");
        button.innerHTML = "Join call";
        button.disabled = false;
      });
  } else {
    disconnect();
    button.innerHTML = "Join call";
    connected = false;
    shareScreen.innerHTML = "Share screen";
    shareScreen.disabled = true;
  }
}

function connect(username) {
  let promise = new Promise((resolve, reject) => {
    // get a token from the back end
    let data;
    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ username: username }),
    })
      .then((res) => res.json())
      .then((_data) => {
        // join video call
        data = _data;
        return Twilio.Video.connect(data.token);
      })
      .then((_room) => {
        room = _room;
        room.participants.forEach(participantConnected);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        connected = true;
        toggleMode.disabled = false;
        unmuteAudio.disabled = false;
        showVideo.disabled = false;
        console.log("dying");
        room.localParticipant.videoTracks.forEach((publication) => {
          publication.track.disable();
        });
        room.localParticipant.audioTracks.forEach((publication) => {
          publication.track.disable();
        });
        pollDiv.style.display = "block";
        updateParticipantCount();
        connectChat(data.token, data.conversation_sid);
        root.classList.add("withChat");
        chatScroll.scrollTop = chatScroll.scrollHeight;
        document.getElementById("chat").style.visibility = "visible";
        usernameInput.style.display = "none";
        document.getElementsByClassName("start_party")[0].style.display =
          "flex";
        document.getElementsByClassName("start_party")[1].style.display =
          "block";
        mutePage();
        resolve();
      })
      .catch((e) => {
        console.log(e);
        reject();
      });
  });
  return promise;
}

function updateParticipantCount() {
  if (!connected) count.innerHTML = "Disconnected.";
  else count.innerHTML = room.participants.size + 1 + " participants online.";
}

function participantConnected(participant) {
  let participantDiv = document.createElement("div");
  participantDiv.setAttribute("id", participant.sid);
  participantDiv.setAttribute("class", "participant");

  let tracksDiv = document.createElement("div");
  participantDiv.appendChild(tracksDiv);

  let labelDiv = document.createElement("div");
  labelDiv.setAttribute("class", "label");
  labelDiv.innerHTML = participant.identity;
  participantDiv.appendChild(labelDiv);

  container.appendChild(participantDiv);

  participant.tracks.forEach((publication) => {
    if (publication.isSubscribed) trackSubscribed(tracksDiv, publication.track);
  });
  participant.on("trackSubscribed", (track) =>
    trackSubscribed(tracksDiv, track)
  );
  participant.on("trackUnsubscribed", trackUnsubscribed);

  updateParticipantCount();
}

function participantDisconnected(participant) {
  document.getElementById(participant.sid).remove();
  updateParticipantCount();
}

function trackSubscribed(div, track) {
  let trackElement = track.attach();
  trackElement.addEventListener("click", () => {
    zoomTrack(trackElement);
  });
  div.appendChild(trackElement);
}

function trackUnsubscribed(track) {
  track.detach().forEach((element) => {
    if (element.classList.contains("participantZoomed")) {
      zoomTrack(element);
    }
    element.remove();
  });
}

function disconnect() {
  room.disconnect();
  if (chat) {
    chat.shutdown().then(() => {
      conv = null;
      chat = null;
    });
  }
  while (container.lastChild.id != "local")
    container.removeChild(container.lastChild);
  button.innerHTML = "Join call";
  root.classList.remove("withChat");
  document.getElementById("chat").style.visibility = "hidden";
  toggleChat.disabled = true;
  toggleMode.disabled = true;
  pollDiv.style.display = "none";
  connected = false;
  // document.getElementById("userLabel").style.display = "inline-block";
  usernameInput.style.display = "inline-block";
  [...document.getElementsByClassName("start_party")].forEach((element) => {
    element.style.display = "none";
  });
  updateParticipantCount();
}

function shareScreenHandler() {
  event.preventDefault();
  if (!screenTrack) {
    navigator.mediaDevices
      .getDisplayMedia()
      .then((stream) => {
        screenTrack = new Twilio.Video.LocalVideoTrack(stream.getTracks()[0]);
        room.localParticipant.publishTrack(screenTrack);
        screenTrack.mediaStreamTrack.onended = () => {
          shareScreenHandler();
        };
        console.log(screenTrack);
        shareScreen.innerHTML = "Stop sharing";
      })
      .catch(() => {
        alert("Could not share the screen.");
      });
  } else {
    room.localParticipant.unpublishTrack(screenTrack);
    screenTrack.stop();
    screenTrack = null;
    shareScreen.innerHTML = "Share screen";
  }
}

function zoomTrack(trackElement) {
  if (!trackElement.classList.contains("trackZoomed")) {
    // zoom in
    container.childNodes.forEach((participant) => {
      if (
        participant.classList &&
        participant.classList.contains("participant")
      ) {
        let zoomed = false;
        participant.childNodes[0].childNodes.forEach((track) => {
          if (track === trackElement) {
            track.classList.add("trackZoomed");
            zoomed = true;
          }
        });
        if (zoomed) {
          participant.classList.add("participantZoomed");
        } else {
          participant.classList.add("participantHidden");
        }
      }
    });
  } else {
    // zoom out
    container.childNodes.forEach((participant) => {
      if (
        participant.classList &&
        participant.classList.contains("participant")
      ) {
        participant.childNodes[0].childNodes.forEach((track) => {
          if (track === trackElement) {
            track.classList.remove("trackZoomed");
          }
        });
        participant.classList.remove("participantZoomed");
        participant.classList.remove("participantHidden");
      }
    });
  }
}

function connectChat(token, conversationSid) {
  return Twilio.Conversations.Client.create(token)
    .then((_chat) => {
      chat = _chat;
      return chat.getConversationBySid(conversationSid).then((_conv) => {
        conv = _conv;
        conv.on("messageAdded", (message) => {
          addMessageToChat(message.author, message.body);
        });
        return conv.getMessages().then((messages) => {
          chatContent.innerHTML = "";
          for (let i = 0; i < messages.items.length; i++) {
            addMessageToChat(messages.items[i].author, messages.items[i].body);
          }
          toggleChat.disabled = false;
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

function addMessageToChat(user, message) {
  chatContent.innerHTML += `<p><b>${user}</b>: ${message}`;
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function toggleChatHandler() {
  event.preventDefault();
  if (root.classList.contains("withChat")) {
    root.classList.remove("withChat");
    document.getElementById("chat").style.visibility = "hidden";
  } else {
    root.classList.add("withChat");
    chatScroll.scrollTop = chatScroll.scrollHeight;
    document.getElementById("chat").style.visibility = "visible";
  }
}

function onChatInputKey(ev) {
  if (ev.keyCode == 13) {
    conv.sendMessage(chatInput.value);
    chatInput.value = "";
  }
}



function unmute_audio() {
  event.preventDefault();
  room.localParticipant.audioTracks.forEach((publication) => {
    publication.track.enable();
  });
}
function show_video() {
  event.preventDefault();
  room.localParticipant.videoTracks.forEach((publication) => {
    publication.track.enable();
  });
}
function mute_audio() {
  event.preventDefault();
  room.localParticipant.audioTracks.forEach((publication) => {
    publication.track.disable();
  });
}
function hide_video() {
  event.preventDefault();
  room.localParticipant.videoTracks.forEach((publication) => {
    publication.track.disable();
  });
}

function audioHandler() {
  event.preventDefault();
  if (unmuteAudio.innerHTML == "Unmute Audio") {
    unmute_audio();
    unmuteAudio.innerHTML = "Mute Audio";
  } else if (unmuteAudio.innerHTML == "Mute Audio") {
    mute_audio();
    unmuteAudio.innerHTML = "Unmute Audio";
  }
}

function videoHandler() {
  event.preventDefault();
  if (showVideo.innerHTML == "Show Video") {
    show_video();
    showVideo.innerHTML = "Hide Video";
  } else if (showVideo.innerHTML == "Hide Video") {
    hide_video();
    showVideo.innerHTML = "Show Video";
  }
}

function toggleModeHandler() {
  event.preventDefault();
  //mute yourself by default
  if (unmuteAudio.innerHTML == "Mute Audio") {
    mute_audio();
    unmuteAudio.innerHTML = "Unmute Audio";
  }
  //switch off video by default
  if (showVideo.innerHTML == "Hide Video") {
    hide_video();
    showVideo.innerHTML = "Show Video";
  }
  //stop screenshare by default
  if (screenTrack) {
    room.localParticipant.unpublishTrack(screenTrack);
    screenTrack.stop();
    screenTrack = null;
    shareScreen.innerHTML = "Share screen";
  }

  if (container.classList.contains("realtime")) {
    container.classList.remove("realtime");
    //option to go back to relaxed mode
    toggleMode.innerHTML = "Relaxed Mode";
    //make all releavant buttons visible
    [...document.getElementsByClassName("realtime")].forEach((element) => {
      element.style.display = "inline-block";
    });
    //unmute all the page audio and video
    unmmutePage();
  } else {
    //hide all releavant buttons
    [...document.getElementsByClassName("realtime")].forEach((element) => {
      element.style.display = "none";
    });
    container.classList.add("realtime");
    //option to go live
    toggleMode.innerHTML = "Go Live";
    //mute all the page audio and video
    mutePage();
  }
}

function polling() {
  event.preventDefault();
  endPoll = document.getElementById("end_poll");
  poll_url = document.getElementById("polling").value;
  if (poll_url != "") {
    // document.getElementById("submit_url").style.display = "none";
    // document.getElementById("choices").style.display = "flex";
    // document.getElementById("polling_url").innerHTML =
    //   "Yay or Nay?&nbsp;" +
    //   "<a href='" +
    //   poll_url +
    //   "' target = '_blank'>" +
    //   poll_url +
    //   "</a>&nbsp;";
    // endPoll.style.display = "flex";
  }

  // endPoll.onclick = function () {};
}

addLocalVideo();
button.addEventListener("click", connectButtonHandler);
shareScreen.addEventListener("click", shareScreenHandler);
toggleChat.addEventListener("click", toggleChatHandler);
toggleMode.addEventListener("click", toggleModeHandler);
unmuteAudio.addEventListener("click", audioHandler);
showVideo.addEventListener("click", videoHandler);
chatInput.addEventListener("keyup", onChatInputKey);
pollURL.addEventListener("click", polling);
