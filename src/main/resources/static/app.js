document.addEventListener("DOMContentLoaded", function() { startplayer(); }, false);

  var player;
  var played = false;

  function startplayer()
  {
  player = document.getElementById('video_player');
  player.controls = false;
  }
  function play_vid()
  {
  if (played == false){
  sendMessagePlay();
  player.play();
  played = true;
  }
  }
  function pause_vid()
  {
  if (played == true){
  sendMessagePause();
  player.pause();
  played = false;
  }
  }
  function stop_vid()
  {
  player.pause();
  player.currentTime = 0;
  }
  function change_vol()
  {
  player.volume=document.getElementById("change_vol").value;
  }

	        var stompClient = null;

	        function setConnected(connected) {

	            document.getElementById('connect').disabled = connected;
	            document.getElementById('disconnect').disabled = !connected;
	            document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
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

	        function sendMessagePlay() {

	            var text = "play";
	            stompClient.send("/app/chat", {}, JSON.stringify({'text':text}));
	        }

	        function sendMessagePause() {

            	var text = "pause";
            	stompClient.send("/app/chat", {}, JSON.stringify({'text':text}));
            }


	        function showMessageOutput(messageOutput) {
	          if (messageOutput.text == "play") {
            	        $('#play_button').click();
              }
              if (messageOutput.text == "pause") {
                        $('#pause_button').click();
              }

                console.log(messageOutput.text);
	            var response = document.getElementById('response');
	            var p = document.createElement('p');
	            p.style.wordWrap = 'break-word';
	            p.appendChild(document.createTextNode( messageOutput.text + " (" + messageOutput.time + ")"));
	            response.appendChild(p);
	        }
