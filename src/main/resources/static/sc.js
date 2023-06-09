const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input");
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        sendSpeed(mainVideo.playbackRate);
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
skipBackward.addEventListener("click", function(){
 mainVideo.currentTime -= 5;
 sendSkip(mainVideo.currentTime);
});
skipForward.addEventListener("click", function(){
 mainVideo.currentTime += 5;
 sendSkip(mainVideo.currentTime);
});
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
/*playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play()  : mainVideo.pause());*/
playPauseBtn.addEventListener("click", function(){
if(mainVideo.paused) {
    mainVideo.play();
    sendMessagePlay(mainVideo.currentTime);
}else{
    mainVideo.pause()
    sendMessagePause(mainVideo.currentTime);
}
});
videoTimeline.addEventListener("mousedown", function(){
videoTimeline.addEventListener("mousemove", draggableProgressBar);
});
document.addEventListener("mouseup", function(){
 videoTimeline.removeEventListener("mousemove", draggableProgressBar);
 sendSkip(mainVideo.currentTime);
});


  var stompClient = null;

	        function setConnected(connected) {
	            document.getElementById('response').innerHTML = '';
	        }

	        function connect() {

	            var socket = new SockJS('/chat');
	            stompClient = Stomp.over(socket);

	            stompClient.connect({}, function(frame) {

	            	setConnected(true);
	                console.log('Connected: ' + frame);
	                stompClient.subscribe('/topic/messages', function(messageOutput) {

	                    showMessageOutput(JSON.parse(messageOutput.body));
	                });
	            });
	        }

	        function disconnect() {

	            if(stompClient != null) {
	                stompClient.disconnect();
	            }

	            setConnected(false);
	            console.log("Disconnected");
	        }

	        function reload() {
            	            var text = "rvtjspxesmreload";
            	            stompClient.send("/app/chat", {}, JSON.stringify({'text':text}));
            	        }
            	        function send() {
            	        textarea = document.getElementById("btn-input");
            	        text = textarea.value;
                        stompClient.send("/app/chat", {}, JSON.stringify({'text':text}));
                        }

            	        function sendMessagePlay(currentTime) {

            	            var text = "rvtjspxesmplay";
            	            stompClient.send("/app/chat", {}, JSON.stringify({'text':text,"currentTime":currentTime}));
            	        }

            	        function sendMessagePause(currentTime) {

                        	var text = "rvtjspxesmpause";
                        	stompClient.send("/app/chat", {}, JSON.stringify({'text':text,"currentTime":currentTime}));
                        }

                        function sendSkip(currentTime) {

                            var text = "rvtjspxesmskip";
                            stompClient.send("/app/chat", {}, JSON.stringify({'text':text,"currentTime":currentTime}));
                        }
                        function sendSpeed(currentTime) {

                             var text = "rvtjspxesmspeed";
                             stompClient.send("/app/chat", {}, JSON.stringify({'text':text,"currentTime":currentTime}));
                        }
                         function sendSpeed(currentTime) {
                         var text = "rvtjspxesmspeed";
                         stompClient.send("/app/chat", {}, JSON.stringify({'text':text,"currentTime":currentTime}));
                         }


	        function showMessageOutput(messageOutput) {
	          if (messageOutput.text == "rvtjspxesmplay") {
            	         mainVideo.currentTime = messageOutput.currentTime;
                         mainVideo.play() ;
              }
              if (messageOutput.text == "rvtjspxesmpause") {
                                  mainVideo.currentTime = messageOutput.currentTime;
                                  mainVideo.pause();
                            }
                            if (messageOutput.text == "rvtjspxesmskip") {
                                  mainVideo.currentTime = messageOutput.currentTime;
                            }
                            if (messageOutput.text == "rvtjspxesmspeed") {
                                  mainVideo.playbackRate = messageOutput.currentTime;
                            }
                            if (messageOutput.text == "rvtjspxesmreload") {
                                  var response = document.getElementById('response');
                                  setTimeout(function(){
                                  		location.reload();
                                  	}, 5000);

                            }
                if (!messageOutput.text.includes("rvtjspxesm")){
	            var response = document.getElementById('r1');
	            var p = document.createElement('p');
	            p.style.wordWrap = 'break-word';
	            p.appendChild(document.createTextNode( messageOutput.text ));
	            response.appendChild(p);
	            }
	        }

