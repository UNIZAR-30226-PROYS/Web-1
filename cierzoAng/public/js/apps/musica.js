/*************************************************************************
 * Script que controla el reproductor de musica de la Web
 *************************************************************************/


var wHolding   = false;
var wTrack     = document.getElementById('track');
var wProgress  = document.getElementById('progress');
var wPlay     = document.getElementById('wPlay');
var wNext     = document.getElementById('wNext');
var wPrev     = document.getElementById('wPrev');
var wTitle    = document.getElementById('wTitle');
var wArtist   = document.getElementById('wArtist');
var wArt      = document.getElementById('wArt');
var wList      = document.getElementById('wLista');

var cur       = document.getElementById('current');
var final     = document.getElementById('final');

var current_track = 0;
var song, audio, duration;
var playing = false;

/* Canciones para probar */

var songs = [{
    title: 'La llamada',
    artist: 'Leiva',
    url: 'songs/llamada.mp3',
    art: 'http://abarcarodriguez.com/365/files/offspring.jpg'
},
    
{
    title: 'Bribriblibli',
    artist: 'Extremoduro',
    url: 'songs/bribri.mp3',
    art: 'http://abarcarodriguez.com/365/files/anamanaguchi.jpg'
},

{
    title: 'Deltoya',
    artist: 'Extremoduro',
    url: 'songs/Deltoya.mp3',
    art: 'http://abarcarodriguez.com/365/files/rainbow.jpg'
},
    
{
    title: 'Felices los 4',
    artist: 'Maluma',
    url: 'songs/felise.mp3',
    art: 'http://abarcarodriguez.com/365/files/anamanaguchi.jpg'
}

];


var context,src;



var analyser,canvas,ctx,bufferLength,dataArray,WIDTH,HEIGHT,barWidth,barHeight,x;


/**
 * Tras cargar la pagina por completo, llama a la funcion iniciarWeb
 */
window.addEventListener('load', iniciarWeb(), false);


/**
 * Funcion inicializadora de la pagina Web
 */
function iniciarWeb() {
    song = songs[current_track];
    audio = new Audio();
    audio.src = song.url;
    wTitle.textContent = song.title;
    wArtist.textContent = song.artist;
    wArt.src = song.art;
    wList.textContent = 'Lista: todas';
    playing=false;


}

/**
 * Cada x tiempo, llama a la funcion actualizarTrackWeb para que actualize el estado
 */
audio.addEventListener('timeupdate', actualizarTrackWeb, false);


/**
 * Cuando halla cargado los datos de la cancion
 */
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
    duration = this.duration;
}, false);

/*
window.onmousemove = function (e) {
    e.preventDefault();
    if (holding) moverTrackWeb(e);
}

window.onmouseup = function (e) {
    holding = false;
}
*/
wTrack.onmousedown = function (e) {
    holding = true;
    if(window.innerWidth>200){
        moverTrackWeb(e);
    }
    else{
        moverTrackMovil(e);
    }
}


/**
 * Cuando el boton Play es pulsado, pausa/reproduce la cancion actual
 */
wPlay.onclick = function () {

    if(playing){
        audio.pause();
        playing=false;
        wPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
    else{
        audio.play();
        playing=true;
        wPlay.innerHTML = '<i class="material-icons">pause</i>';
    }


}


/**
 * Cuando el audio es pausado, se cambia el boton a play
 */
audio.addEventListener("pause", function () {
    wPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
    playing = false;
}, false);


/**
 * Cuando el audio es encendido, se cambia el boton a pause
 */
audio.addEventListener("play", function () {
    wPlay.innerHTML = '<i class="material-icons">pause</i>';
    playing = true;
}, false);


/**
 * Cuando el boton Next es pulsado, llama a la funcion siguienteTrackWeb
 */
wNext.addEventListener("click", siguienteTrackWeb, false);

/**
 * Cuando el boton Prev es pulsado, llama a la funcion anteriorTrackWeb
 */
wPrev.addEventListener("click", anteriorTrackWeb, false);


/**
 * Funcion que actualiza el nuevo estado de la cancion, tras haberla movido
 */
function actualizarTrackWeb() {
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
    wProgress.style.width = percent + '%';
    handler.style.left = percent + '%';

    if(audio.currentTime==audio.duration){
        siguienteTrackWeb();
    }
}

/** Funcion que pone a mueve el tiempo que se esta escuchando del track actual
 */
function moverTrackWeb(e) {
    event = e || window.event;
    var x = e.pageX - reproductorIndex.offsetLeft - wTrack.offsetLeft;
    percent = Math.round((x * 100) / wTrack.offsetWidth);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    wProgress.style.width = percent + '%';
    handler.style.left = percent + '%';
    audio.play();
    audio.currentTime = (percent * duration) / 100
}

/** Funcion que pone a reproducir el track siguiente a la actualmente
 *  reproducida
 */
function siguienteTrackWeb() {
    current_track++;
    current_track = current_track % (songs.length);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoWeb();
      actualizarInfoMovil();
    }
}

/** Funcion que pone a reproducir el track anterior a la actualmente
 *  reproducida
 */
function anteriorTrackWeb() {
    current_track--;
    current_track = (current_track == -1 ? (songs.length - 1) : current_track);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoWeb();
      actualizarInfoMovil();
    }
}

/**
 * Funcion que actualiza la info del track seleccionado
 */
function actualizarInfoWeb() {
    wTitle.textContent = song.title;
    wArtist.textContent = song.artist;
    wArt.src = song.art;
    
}


function playSong(num){
    song = songs[num];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoWeb();
      actualizarInfoMovil();
    }
}







