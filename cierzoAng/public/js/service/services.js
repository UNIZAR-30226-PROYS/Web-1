cierzoApp = angular.module('cierzoApp', ["ngRoute",'ngCookies']);

cierzoApp.factory('authProvider', function() {
    var user=false;
        return {
            setUser : function(aUser){
            user = aUser;
        },
            isLoggedIn : function(){
            return(user)? user : false;
        }
    };
});




cierzoApp.run(['$rootScope', '$cookieStore', '$location', 'authProvider', function ($rootScope, $cookieStore, $location,authProvider) {  

    if($cookieStore.get('conectado')){
        authProvider.setUser(true);
    }

    $rootScope.$on('$routeChangeStart', function (event) {
        if (!authProvider.isLoggedIn() && $location.url()!='/sign') {
            console.log('DENY : Redirecting to Login');
            console.log($location.url());
            event.preventDefault();
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
            if($location.url()=='/'){
                $location.path('/songs');
            }
        }
    });
    
}])







cierzoApp.service('music', function() {
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

    var theUrl='http://192.168.44.128:8080/api/songs'
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );

    songs = JSON.parse(xmlHttp.responseText);


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
        audio.crossOrigin = "anonymous";
        wTitle.textContent = song.name;
        wArtist.textContent = song.authorName;
        wArt.src = theUrl+'/'+song.id+'/image';
        song.art= theUrl+'/'+song.id+'/image';
        wList.textContent = 'Lista: todas';
        playing=false;
        
        audio.src=theUrl+'/'+song.id+'/file';
        

    }

    /**
     * Cada x tiempo, llama a la funcion actualizarTrackWeb para que actualize el estado
     */
    //audio.addEventListener('timeupdate', this.actualizarTrackWeb, false);


    audio.ontimeupdate = function() {actualizarTrackWeb()};


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
        console.log(e);
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
            playing=true;
            audio.play();
            wPlay.innerHTML = '<i class="material-icons">pause</i>';
        }


    }

    wPrev.onclick = function () {
        current_track--;
        current_track = (current_track == -1 ? (songs.length - 1) : current_track);
        song = songs[current_track];
        song.art= theUrl+'/'+song.id+'/image';
        audio.src = theUrl+'/'+song.id+'/file';
        audio.onloadeddata = function() {
            actualizarInfoWeb();
            if(playing){
                audio.play();
            }
            //actualizarInfoMovil();
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
    //wNext.addEventListener("click", siguienteTrackWeb(), false);

    /**
     * Cuando el boton Prev es pulsado, llama a la funcion anteriorTrackWeb
     */
    //wPrev.addEventListener("click", anteriorTrackWeb(), false);


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
        //console.log(curtime);

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
        
        audio.currentTime = (percent * duration) / 100;

        /*
        console.log(percent);
        console.log(audio.duration);
        console.log((percent * duration) / 100);
        console.log(audio.currentTime);*/

        audio.play();
    }

    
    /** Funcion que pone a reproducir el track siguiente a la actualmente
     *  reproducida
     */
    /*
    this.siguienteTrackWeb=function () {
        current_track++;
        current_track = current_track % (songs.length);
        song = songs[current_track];
        song.art= theUrl+'/'+song.id+'/image';
        audio.src = theUrl+'/'+song.id+'/image';
        audio.onloadeddata = function() {
            actualizarInfoWeb();
            //actualizarInfoMovil();
        }
    }*/

    /** Funcion que pone a reproducir el track anterior a la actualmente
     *  reproducida
     */
    /*
    this.anteriorTrackWeb=function () {
        current_track--;
        current_track = (current_track == -1 ? (songs.length - 1) : current_track);
        song = songs[current_track];
        audio.src = song.url;
        audio.onloadeddata = function() {
            actualizarInfoWeb();
            //actualizarInfoMovil();
        }
    }*/


    

    
    wNext.onclick = function () {
        current_track++;
        current_track = current_track % (songs.length);
        song = songs[current_track];
        song.art= theUrl+'/'+song.id+'/image';
        audio.src = theUrl+'/'+song.id+'/file';
        audio.onloadeddata = function() {
            actualizarInfoWeb();
            if(playing){
                audio.play();
            }
            //actualizarInfoMovil();
        }

    }


    /**
     * Funcion que actualiza la info del track seleccionado
     */
    function actualizarInfoWeb() {
        wTitle.textContent = song.name;
        wArtist.textContent = song.authorName;
        wArt.src = song.art;
        
    }


    this.playSongId=function(id) {
        for(var i=0;i<songs.length;i++){
            if(songs[i].id==id){
                song=songs[i];
                current_track=i;
                var esta=true;
            }
        }
        if(esta){
            song.art=theUrl+'/'+song.id+'/image';
            audio.src=theUrl+'/'+song.id+'/file';
            audio.onloadeddata = function() {
                actualizarInfoWeb();
                audio.play();
                //actualizarInfoMovil();
            }
        }

    }

    this.cambiarSongs=function(canci,nombre) {
        wList.textContent ='Lista: '+nombre;
        songs=canci;

    }





});
