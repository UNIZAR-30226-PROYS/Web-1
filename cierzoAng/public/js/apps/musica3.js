/*************************************************************************
 * Script que controla el reproductor de musica de la Web version Completa
 *************************************************************************/

var holding        = false;
var playing        = false;
var ctrack          = document.getElementById('track3');
var cprogress       = document.getElementById('progress3');
var cPlay          = document.getElementById('cPlay');
var cNext          = document.getElementById('cNext');
var cPrev          = document.getElementById('cPrev');
var cTitle         = document.getElementById('cTitle');
var cArtist        = document.getElementById('cArtist');
var cArt           = document.getElementById('cArt');
var cAlbum         = document.getElementById('cAlbum');

var ccur = document.getElementById('current3');
var cfinal = document.getElementById('final3');
var duration, percent, curtime2;
var current_track = 0;

var context,src;



var analyser,ctx,bufferLength,dataArray,WIDTH,HEIGHT,barWidth,barHeight,x;

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

/**
 * Tras cargar la pagina por completo, llama a la funcion iniciarWeb
 */
window.addEventListener('load', iniciarSong(), false);


/**
 * Funcion inicializadora de la pagina Web
 */
function iniciarSong() {
  song3 = songs[current_track];
  audio = new Audio();
  audio.src = song3.url;
  cTitle.textContent = song3.title;
  cArtist.textContent = song3.artist;
  cArt.src = song3.art;
  cAlbum.textContent = 'Album: DESCONOCIDO';
  playing=false;

}

/**
 * Cada x tiempo, llama a la funcion actualizarTrackWeb para que actualize el estado
 */
audio.addEventListener('timeupdate', actualizarTrackSong, false);

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
    ccur.innerHTML=tfin;
    cfinal.innerHTML='00:00'
    duration = this.duration;
}, false);


window.onmousemove = function (e) {
    e.preventDefault();
    if (holding){
        if(window.innerWidth>600){
            moverTrackSong(e);
        }
        else{
            moverTrackSong(e);
        }


    }
}
window.onmouseup = function (e) {
    holding = false;
}

ctrack.onmousedown = function (e) {
    holding = true;
    if(window.innerWidth>600){
        moverTrackSong(e);
    }
    else{
        moverTrackSong(e);
    }
}


/**
 * Cuando el boton Play es pulsado, pausa/reproduce la cancion actual
 */
cPlay.onclick = function () {
    if(playing){
        audio.pause();
        playing=false;
    }
    else{
        //audio.play();
        pruebaVisualizer($('canvas')[0]);
        playing=true;
    }


}

/**
 * Cuando el audio es pausado, se cambia el boton a play
 */
audio.addEventListener("pause", function () {
    cPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
    playing = false;
}, false);

/**
 * Cuando el audio es encendido, se cambia el boton a pause
 */
audio.addEventListener("play", function () {
    cPlay.innerHTML = '<i class="material-icons">pause</i>';
    playing = true;
    //pruebaVisualizer($('canvas')[0]);
}, false);

/**
 * Cuando el boton Next es pulsado, llama a la funcion siguienteTrackWeb
 */
cNext.addEventListener("click", siguienteTrackSong, false);

/**
 * Cuando el boton Prev es pulsado, llama a la funcion anteriorTrackWeb
 */
cPrev.addEventListener("click", anteriorTrackSong, false);


/**
 * Funcion que actualiza el nuevo estado de la cancion, tras haberla movido
 */
function actualizarTrackSong() {
    var tfin='0'+Math.floor(audio.currentTime/60)+':';
    var resto=Math.floor(audio.currentTime%60);
    if(resto<10){
        tfin=tfin+'0'+resto;
    }
    else{
        tfin=tfin+resto;
    }

    cfinal.innerHTML=tfin;


    curtime2 = audio.currentTime;
    percent = Math.round((curtime2 * 100) / duration);
    cprogress.style.width = percent + '%';
    handler3.style.left = percent + '%';

    if(audio.currentTime >= audio.duration){
        siguienteTrackSong();
    }
}

/** Funcion que pone a mueve el tiempo que se esta escuchando del track actual
 */
function moverTrackSong(e) {
    event = e || window.event;
    var x = e.pageX - ctrack.offsetLeft;// - ctrack.offsetLeft;
    percent = Math.round((x * 100) / ctrack.offsetWidth);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    cprogress.style.width = percent + '%';
    handler3.style.left = percent + '%';
    audio.play();
    audio.currentTime = (percent * duration) / 100
}

/** Funcion que pone a reproducir el track siguiente a la actualmente
 *  reproducida
 */
function siguienteTrackSong() {
    current_track++;
    current_track = current_track % (songs.length);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoSong();
    }
    if(playing) audio.play();
}

/** Funcion que pone a reproducir el track anterior a la actualmente
 *  reproducida
 */
function anteriorTrackSong() {
    current_track--;
    current_track = (current_track == -1 ? (songs.length - 1) : current_track);
    song = songs[current_track];
    audio.src = song.url;
    audio.onloadeddata = function() {
      actualizarInfoSong();
    }
    if(playing) audio.play();
}

/**
 * Funcion que actualiza la info del track seleccionado
 */
function actualizarInfoSong() {
    cTitle.textContent = song.title;
    cArtist.textContent = song.artist;
    cArt.src = song.art;

}
