
var holding = false;
var play=false;
var track = document.getElementById('track');
var progress = document.getElementById('progress');
var play = document.getElementById('play');
var next = document.getElementById('next');
var prev = document.getElementById('prev');
var title = document.getElementById('title');
var artist = document.getElementById('artist');
var art = document.getElementById('art');
var current_track = 0;
var song, audio, duration;
var playing = false;
var songs = [{
    title: 'La llamada',
    artist: 'Leiva',
    url: 'llamada.mp3',
    art: 'http://abarcarodriguez.com/365/files/offspring.jpg'
},
    
{
    title: 'Bribriblibli',
    artist: 'Extremoduro',
    url: 'bribri.mp3',
    art: 'http://abarcarodriguez.com/365/files/anamanaguchi.jpg'
},

{
    title: 'Deltoya',
    artist: 'Extremoduro',
    url: 'Deltoya.mp3',
    art: 'http://abarcarodriguez.com/365/files/rainbow.jpg'
}];

var context,src;



var analyser,canvas,ctx,bufferLength,dataArray,WIDTH,HEIGHT,barWidth,barHeight,x;


window.addEventListener('load', init(), false);





function renderFrame() {
  requestAnimationFrame(renderFrame);

  x = 0;

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    
    var r = barHeight + (25 * (i/bufferLength));
    var g = 250 * (i/bufferLength);
    var b = 50;

    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}




function makeDistortionCurve( amount ) {
      var k = typeof amount === 'number' ? amount : 0,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
      }
      return curve;
    };

var dist,gain,range;


function init() {
    console.log("HOI");
    song = songs[current_track];
    audio = new Audio();
    audio.src = song.url;
    title.textContent = song.title;
    artist.textContent = song.artist;
    art.src = song.art;



    
    context = new AudioContext();
    src = context.createMediaElementSource(audio);


    //***** Ecualizador ******//
    //distorsion
    dist = context.createWaveShaper();
    gain = context.createGain();

    src.connect(gain);
    gain.connect(dist);
    dist.connect(context.destination);

    gain.gain.value = 1;
    dist.curve = makeDistortionCurve(0);

    range = document.querySelector('#range');
    range.addEventListener('input', function(){
      var value = parseInt(this.value) * 5;
      dist.curve = makeDistortionCurve(value);
    });
    
    //***********//



    //*************Visualizador*************//

    analyser = context.createAnalyser();

    canvas = document.getElementById("canvas");
    canvas.width = 1000;
    canvas.height = 250;
    ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    dataArray = new Uint8Array(bufferLength);

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    barWidth = (WIDTH / bufferLength) * 2.5;
    barHeight;
    x = 0;

    //**************************//







    //
}


audio.addEventListener('timeupdate', updateTrack, false);
audio.addEventListener('loadedmetadata', function () {
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

    if(!playing){
        renderFrame();
    }
    playing ? audio.pause() : audio.play();
}
audio.addEventListener("pause", function () {
    play.innerHTML = '<img class="pad" src="http://abarcarodriguez.com/lab/play.png" />';
    playing = false;
}, false);

audio.addEventListener("playing", function () {
    play.innerHTML = '<img src="http://abarcarodriguez.com/lab/pause.png" />';
    playing = true;
}, false);
next.addEventListener("click", nextTrack, false);
prev.addEventListener("click", prevTrack, false);


function updateTrack() {
    curtime = audio.currentTime;
    percent = Math.round((curtime * 100) / duration);
    progress.style.width = percent + '%';
    handler.style.left = percent + '%';
}

function seekTrack(e) {
    event = e || window.event;
    var x = e.pageX - player.offsetLeft - track.offsetLeft;
    percent = Math.round((x * 100) / track.offsetWidth);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    progress.style.width = percent + '%';
    handler.style.left = percent + '%';
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
    art.src = song.art;
    art.onload = function() {
        audio.play();
    }
}






