/*************************************************************************
 * Script que controla el reproductor de musica de la Web version Movil
 *************************************************************************/

var holding        = false;
var playing        = false;
var track          = document.getElementById('track2');
var progress       = document.getElementById('progress2');
var mPlay          = document.getElementById('mPlay');
var mNext          = document.getElementById('mNext');
var mPrev          = document.getElementById('mPrev');
var mTitle         = document.getElementById('mTitle');
var mArtist        = document.getElementById('mArtist');

var cur = document.getElementById('current2');
var final = document.getElementById('final2');

var current_track = 0;


var context,src;



var analyser,canvas,ctx,bufferLength,dataArray,WIDTH,HEIGHT,barWidth,barHeight,x;

/**
 * Tras cargar la pagina por completo, llama a la funcion iniciarWeb
 */
window.addEventListener('load', iniciarMovil(), false);


/**
 * Funcion inicializadora de la pagina Web
 */
function iniciarMovil() {
    console.log("HOI");
    song = songs[current_track];
    audio = new Audio();
    audio.src = song.url;
    mTitle.textContent = song.title;
    mArtist.textContent = song.artist;
    playing=false;


}

/**
 * Cada x tiempo, llama a la funcion actualizarTrackWeb para que actualize el estado
 */
audio.addEventListener('timeupdate', actualizarTrackMovil, false);

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
    console.log(audio.duration);
    duration = this.duration;
}, false);


window.onmousemove = function (e) {
    e.preventDefault();
    if (holding) moverTrackMovil(e);
}
window.onmouseup = function (e) {
    holding = false;
    console.log(holding);
}
track.onmousedown = function (e) {
    holding = true;
    moverTrackMovil(e);
    console.log(holding);
}

/**
 * Cuando el boton Play es pulsado, pausa/reproduce la cancion actual
 */
mPlay.onclick = function () {
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

/**
 * Cuando el audio es pausado, se cambia el boton a play
 */
audio.addEventListener("pause", function () {
    mPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
    playing = false;
}, false);

/**
 * Cuando el audio es encendido, se cambia el boton a pause
 */
audio.addEventListener("play", function () {
    mPlay.innerHTML = '<i class="material-icons">pause</i>';
    playing = true;
}, false);

/**
 * Cuando el boton Next es pulsado, llama a la funcion siguienteTrackWeb
 */
mNext.addEventListener("click", siguienteTrackMovil, false);

/**
 * Cuando el boton Prev es pulsado, llama a la funcion anteriorTrackWeb
 */
mPrev.addEventListener("click", anteriorTrackMovil, false);


/**
 * Funcion que actualiza el nuevo estado de la cancion, tras haberla movido
 */
function actualizarTrackMovil() {
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
        siguienteTrackMovil();
    }
}

/** Funcion que pone a mueve el tiempo que se esta escuchando del track actual
 */
function moverTrackMovil(e) {
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

/** Funcion que pone a reproducir el track siguiente a la actualmente
 *  reproducida
 */
function siguienteTrackMovil() {
    current_track++;
    current_track = current_track % (songs.length);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoMovil();
    }
}

/** Funcion que pone a reproducir el track anterior a la actualmente
 *  reproducida
 */
function anteriorTrackMovil() {
    current_track--;
    current_track = (current_track == -1 ? (songs.length - 1) : current_track);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoMovil();
    }
}

/**
 * Funcion que actualiza la info del track seleccionado
 */
function actualizarInfoMovil() {
    mTitle.textContent = song.title;
    mArtist.textContent = song.artist;
    if(playing) audio.play();
    else        audio.pause();
}






