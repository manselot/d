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
  $('#sendMessagePlay').click();
  player.play();
  played = true;
  }
  }
  function pause_vid()
  {
  if (played == true){
  $('#sendMessagePause').click();
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