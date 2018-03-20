
var holding = false;
var play=false;
var track = document.getElementById('track2');
var progress = document.getElementById('progress2');
var play = document.getElementById('play2');
var next = document.getElementById('next2');
var prev = document.getElementById('prev2');
var title = document.getElementById('title2');
var artist = document.getElementById('artist2');

var cur = document.getElementById('current2');
var final = document.getElementById('final2');

var current_track = 0;


var context,src;



var analyser,canvas,ctx,bufferLength,dataArray,WIDTH,HEIGHT,barWidth,barHeight,x;


window.addEventListener('load', init(), false);



function init() {
    console.log("HOI");
    song = songs[current_track];
    audio = new Audio();
    audio.src = song.url;
    title.textContent = song.title;
    artist.textContent = song.artist;
    playing=false;


}


audio.addEventListener('timeupdate', updateTrack, false);
audio.addEventListener('loadedmetadata', function () {
    var tfin='0'+Math.floor(audio.duration/60)+':';
    var resto=Math.floor(audio.duration%60);
    if(resto<10){
        tfin=tfin+'0'+resto;
    }
    else{
        tfin=tfin+resto;
    }

    cur.innerHTML=tfin;
    final.innerHTML='00:00'
    console.log(audio.duration);
    duration = this.duration;
}, false);
window.onmousemove = function (e) {
    e.preventDefault();
    if (holding) seekTrack(e);
}
window.onmouseup = function (e) {
    holding = false;
    console.log(holding);
}
track.onmousedown = function (e) {
    holding = true;
    seekTrack(e);
    console.log(holding);
}
play.onclick = function () {

    if(playing){
        audio.pause();
        console.log("Parar")
        playing=false;
    }
    else{
        audio.play();
        console.log("Reproducir")
        playing=true;
    }


}
audio.addEventListener("pause", function () {
    play.innerHTML = '<i class="material-icons">play_arrow</i>';
    playing = false;
}, false);

audio.addEventListener("playing", function () {
    play.innerHTML = '<i class="material-icons">pause</i>';
    playing = true;
}, false);
next.addEventListener("click", nextTrack, false);
prev.addEventListener("click", prevTrack, false);


function updateTrack() {

    var tfin='0'+Math.floor(audio.currentTime/60)+':';
    var resto=Math.floor(audio.currentTime%60);
    if(resto<10){
        tfin=tfin+'0'+resto;
    }
    else{
        tfin=tfin+resto;
    }

    final.innerHTML=tfin;


    curtime = audio.currentTime;
    percent = Math.round((curtime * 100) / duration);
    progress.style.width = percent + '%';
    handler2.style.left = percent + '%';

    if(audio.currentTime==audio.duration){
        nextTrack();
    }
}

function seekTrack(e) {
    event = e || window.event;
    var x = e.pageX - reproductorIndex.offsetLeft - track.offsetLeft;
    percent = Math.round((x * 100) / track.offsetWidth);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    progress.style.width = percent + '%';
    handler2.style.left = percent + '%';
    audio.play();
    audio.currentTime = (percent * duration) / 100
}
function nextTrack() {
    current_track++;
    current_track = current_track % (songs.length);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      updateInfo();
    }
}

function prevTrack() {
    current_track--;
    current_track = (current_track == -1 ? (songs.length - 1) : current_track);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      updateInfo();
    }
}

function updateInfo() {
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.play();
}






