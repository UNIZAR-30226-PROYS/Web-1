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



cierzoApp.factory('usuarioActual', function() {
    var user={};
        return {
            setUser : function(aUser){
            user = aUser;
            console.log(user);
        },
            isLoggedIn : function(){
            return(user)? user : false;
        },
        getId : function(){
            return user.id;
        }
    };
});




cierzoApp.run(['$rootScope', '$cookieStore', '$location', 'authProvider','$http','$cookies', function ($rootScope, $cookieStore, $location,authProvider,$http,$cookies) {

    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
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







cierzoApp.service('music',[ '$cookieStore','$http', function($cookieStore,$http) {
    /*************************************************************************
     * Script que controla el reproductor de musica de la Web
     *************************************************************************/

    console.log("MUSCIA")
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

    var wShuffle      = document.getElementById('wShuffle');
    var wRepeat     = document.getElementById('wRepeat');

    var mShuffle      = document.getElementById('mShuffle');
    var mRepeat     = document.getElementById('mRepeat');

    var cShuffle      = document.getElementById('cShuffle');
    var cRepeat     = document.getElementById('cRepeat');

    var cur       = document.getElementById('current');
    var final     = document.getElementById('final');



    var mTrack          = document.getElementById('track2');
    var mProgress       = document.getElementById('progress2');
    var mPlay          = document.getElementById('mPlay');
    var mNext          = document.getElementById('mNext');
    var mPrev          = document.getElementById('mPrev');
    var mTitle         = document.getElementById('mTitle');
    var mArtist        = document.getElementById('mArtist');


    var cTrack          = document.getElementById('track3');
    var cProgress       = document.getElementById('progress3');
    var cPlay          = document.getElementById('cPlay');
    var cNext          = document.getElementById('cNext');
    var cPrev          = document.getElementById('cPrev');
    var cPlay2          = document.getElementById('cPlay2');
    var cNext2          = document.getElementById('cNext2');
    var cPrev2          = document.getElementById('cPrev2');
    var cTitle         = document.getElementById('cTitle');
    var cArtist        = document.getElementById('cArtist');
    var cArt      = document.getElementById('cArt');
    var handler3      = document.getElementById('handler3');
    var cCan      = document.getElementById('canvas1');
    var cCan2      = document.getElementById('canvas2');
    var canvas      = document.getElementById('canvas1');

    var ccur       = document.getElementById('current3');
    var cfinal     = document.getElementById('final3');

    var mcur       = document.getElementById('current2');
    var mfinal     = document.getElementById('final2');

    var current_track = 0;
    var song, audio, duration;
    var playing = false;
    var random=false;
    var repeat=false;

    /* Al ser pulsado cualquier pestaña tras aplicar un filtro, se limpia
     * este */
    document.getElementById('cancione').onclick = function () {
      document.getElementById('busqueda').value="";
    }
    document.getElementById('listaR').onclick = function () {
      document.getElementById('busqueda').value="";
    }
    document.getElementById('albums').onclick = function () {
      document.getElementById('busqueda').value="";
    }
    document.getElementById('artists').onclick = function () {
      document.getElementById('busqueda').value="";
    }
    document.getElementById('usuarios').onclick = function () {
      document.getElementById('busqueda').value="";
    }





    /* Canciones para probar */


    var theUrl2='http://192.168.44.128:8080/api/profiles/'+$cookieStore.get('id');
    var theUrl='http://192.168.44.128:8080/api/songs'

    //llamo sesion
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET",'http://192.168.44.128:8080/api/account/session' , false ); // false for synchronous request
    xmlHttp.withCredentials=true;
    xmlHttp.send( null );

    var lis = JSON.parse(xmlHttp.responseText);
    var cancID;
    var listID;

    //songs=lis.playlists[0].songs;
    console.log(lis);
    console.log(xmlHttp.responseText);
    

    if(jQuery.isEmptyObject(lis)){
        var primeraVez=true;
    }
    else{
        var primeraVez=false;
    }

    

    function buscar(lis,atrib) {
        for(var i=0;i<lis.length;i++){
            if(lis[i].id==atrib){
                return i;
            }
        }

    }

    if(primeraVez){
        console.log("no sesion");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl2, false ); // false for synchronous request
        xmlHttp.send( null );

        var lis = JSON.parse(xmlHttp.responseText);

        songs=lis.playlists[0].songs;
        console.log(lis);

        if(songs.length>0){
            cancID=lis.playlists[0].songs[current_track].id;
            listID=lis.playlists[0].id;
            var cuerpo={
                "playlistID": lis.playlists[0].id.toString(),
                "second": "0",
                "songID": lis.playlists[0].songs[current_track].id.toString()
              };
            $http({
                method: 'PUT',
                url: 'http://192.168.44.128:8080/api/account/session',
                data: cuerpo
            }).then(function successCallback(response) {
                console.log(response.data);
    
    
            }, function errorCallback(response) {
                alert("DEP");
            });
        }
        else{
            listID=lis.playlistID;
            console.log("lista vacia");
            var xmlHttp = new XMLHttpRequest();
            //var theUrl2='http://192.168.44.128:8080/api/playlists/'+lis.playlistID;
            xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
            xmlHttp.send( null );
    
            var lis2 = JSON.parse(xmlHttp.responseText);
            
            
            songs=[];
    
            //current_track=buscar(songs,lis.songID);
        }
        

    }
    else{
        console.log(lis);
        listID=lis.playlistID;
        console.log("si sesion");
        var xmlHttp = new XMLHttpRequest();
        var theUrl2='http://192.168.44.128:8080/api/playlists/'+lis.playlistID;
        xmlHttp.open( "GET", theUrl2, false ); // false for synchronous request
        xmlHttp.send( null );

        var lis2 = JSON.parse(xmlHttp.responseText);

        songs=lis2.songs;

        current_track=buscar(songs,lis.songID);
    }
    




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
        audio = new Audio();
        if(window.innerWidth<400){ //Para poner el visualizador especializado para el movil
          document.getElementById("visualizador").style.width= window.innerWidth+'px';
          document.getElementById("visualizador").style.position='static';
        }
        if(songs.length>0){
            console.log('puedo');
            song = songs[current_track];
            audio.crossOrigin = "anonymous";
            wTitle.textContent = song.name;
            wArtist.textContent = song.authorName;
            mTitle.textContent = song.name;
            mArtist.textContent = song.authorName;
            cTitle.textContent = song.name;
            cArtist.textContent = song.authorName;
            wArt.src = theUrl+'/'+song.id+'/image';
            cArt.src = theUrl+'/'+song.id+'/image';
            song.art= theUrl+'/'+song.id+'/image';
            wList.textContent = 'Lista: Favoritos';
            playing=false;

            audio.src=theUrl+'/'+song.id+'/file';
        }
        else{
            wTitle.textContent = "Lista vacía.";

        }


    }

    /**
     * Cada x tiempo, llama a la funcion actualizarTrackWeb para que actualize el estado
     */
    //audio.addEventListener('timeupdate', this.actualizarTrackWeb, false);


    audio.ontimeupdate = function() {
        actualizarTrackWeb();
        cancID= songs[current_track].id;
        //console.log(audio.currentTime);
        //console.log(audio.currentTime%10);
        if(audio.currentTime%10<1){
            
            if(listID!="no"){
                console.log("envio sesion");
                var cuerpo={
                    "playlistID": listID.toString(),
                    "second": parseInt(audio.duration).toString(),
                    "songID": cancID.toString()
                  };
                  console.log(cuerpo);
                $http({
                    method: 'PUT',
                    url: 'http://192.168.44.128:8080/api/account/session',
                    data: cuerpo
                }).then(function successCallback(response) {
                    //console.log(response.data);
        
        
                }, function errorCallback(response) {
                    //alert("DEP");
                });
            }
            else{
                console.log("Es album");
            }
            
        }
    };


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
        mcur.innerHTML=tfin;
        ccur.innerHTML=tfin;
        final.innerHTML='00:00'
        mfinal.innerHTML='00:00'
        cfinal.innerHTML='00:00'
        duration = this.duration;
    }, false);


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


    mTrack.onmousedown = function (e) {
        holding = true;
        console.log(e);
        if(window.innerWidth>200){
            moverTrackWeb(e);
        }
        else{

            moverTrackMovil(e);
        }
    }

    cTrack.onmousedown = function (e) {
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

    /**
     * Cuando el boton Play es pulsado, pausa/reproduce la cancion actual
     */
    mPlay.onclick = function () {

        if(playing){
            audio.pause();
            playing=false;
            mPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
        }
        else{
            playing=true;
            audio.play();
            mPlay.innerHTML = '<i class="material-icons">pause</i>';
        }


    }


    cPlay.onclick = function () {

        if(playing){
            audio.pause();
            playing=false;
            cPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
        }
        else{
            playing=true;
            audio.play();
            cPlay.innerHTML = '<i class="material-icons">pause</i>';
        }
    }
    cPlay2.onclick = function () {

        if(playing){
            audio.pause();
            playing=false;
            cPlay2.innerHTML = '<i class="material-icons">play_arrow</i>';
        }
        else{
            playing=true;
            audio.play();
            cPlay2.innerHTML = '<i class="material-icons">pause</i>';
        }
    }

    wPrev.onclick = function () {
        if(repeat){
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
        else if(random){
            var num=(Math.floor(Math.random() * 100))%(songs.length);
            while(num==current_track){
                num=(Math.floor(Math.random() * 100))%(songs.length);
            }
            console.log(current_track);
            console.log(num);
            console.log(songs.length);
            current_track=num;
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
        else{
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

    }

    visual.onclick = function () {
        visu(cCan,audio);
    }

    mPrev.onclick = function () {
        if(repeat){
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
        else if(random){
            var num=(Math.floor(Math.random() * 100))%(songs.length);
            while(num==current_track){
                num=(Math.floor(Math.random() * 100))%(songs.length);
            }
            console.log(current_track);
            console.log(num);
            console.log(songs.length);
            current_track=num;
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
        else{
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

    }


    cPrev.onclick = function () {
        if(repeat){
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
        else if(random){
            var num=(Math.floor(Math.random() * 100))%(songs.length);
            while(num==current_track){
                num=(Math.floor(Math.random() * 100))%(songs.length);
            }
            console.log(current_track);
            console.log(num);
            console.log(songs.length);
            current_track=num;
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
        else{
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

    }

    wShuffle.onclick = function () {
        console.log("Ahora random")
        random=!random;
    }

    wRepeat.onclick = function () {
        console.log("Ahora repeat")
        repeat=!repeat;
    }

    mShuffle.onclick = function () {
        console.log("Ahora random")
        random=!random;
    }

    mRepeat.onclick = function () {
        console.log("Ahora repeat")
        repeat=!repeat;
    }

    cShuffle.onclick = function () {
        console.log("Ahora random")
        random=!random;
    }

    cRepeat.onclick = function () {
        console.log("Ahora repeat")
        repeat=!repeat;
    }



    /**
     * Cuando el audio es pausado, se cambia el boton a play
     */
    audio.addEventListener("pause", function () {
        wPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
        mPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
        cPlay.innerHTML = '<i class="material-icons">play_arrow</i>';
        cPlay2.innerHTML = '<i class="material-icons">play_arrow</i>';
        playing = false;

    }, false);


    /**
     * Cuando el audio es encendido, se cambia el boton a pause
     */
    audio.addEventListener("play", function () {
        wPlay.innerHTML = '<i class="material-icons">pause</i>';
        mPlay.innerHTML = '<i class="material-icons">pause</i>';
        cPlay.innerHTML = '<i class="material-icons">pause</i>';
        cPlay2.innerHTML = '<i class="material-icons">pause</i>';
        playing = true;
    }, false);


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
        mfinal.innerHTML=tfin;
        cfinal.innerHTML=tfin;

        curtime = audio.currentTime;
        //console.log(curtime);

        percent = Math.round((curtime * 100) / duration);
        wProgress.style.width = percent + '%';
        mProgress.style.width = percent + '%';
        cProgress.style.width = percent + '%';
        handler.style.left = percent + '%';
        handler2.style.left = percent + '%';
        handler3.style.left = percent + '%';

        if(audio.currentTime==audio.duration){
            wNext.click();
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
        mProgress.style.width = percent + '%';
        cProgress.style.width = percent + '%';
        handler2.style.left = percent + '%';
        handler3.style.left = percent + '%';

        audio.currentTime = (percent * duration) / 100;

        /*
        console.log(percent);
        console.log(audio.duration);
        console.log((percent * duration) / 100);
        console.log(audio.currentTime);*/

        audio.play();
    }

    function moverTrackBig(e) {
        event = e || window.event;
        var x = e.pageX - reproductorIndex.offsetLeft - cTrack.offsetLeft;
        percent = Math.round((x * 100) / cTrack.offsetWidth);

        if (percent > 100) percent = 100;
        if (percent < 0) percent = 0;
        cProgress.style.width = percent + '%';
        handler3.style.left = percent + '%';

        audio.currentTime = (percent * duration) / 100;

        /*
        console.log(percent);
        console.log(audio.duration);
        console.log((percent * duration) / 100);
        console.log(audio.currentTime);*/

        audio.play();
    }


    function moverTracMovil(e) {
        event = e || window.event;
        var x = e.pageX - reproductorIndex.offsetLeft - mTrack.offsetLeft;
        percent = Math.round((x * 100) / mTrack.offsetWidth);

        if (percent > 100) percent = 100;
        if (percent < 0) percent = 0;
        mProgress.style.width = percent + '%';
        handler.style.left = percent + '%';

        audio.currentTime = (percent * duration) / 100;

        /*
        console.log(percent);
        console.log(audio.duration);
        console.log((percent * duration) / 100);
        console.log(audio.currentTime);*/

        audio.play();
    }





    wNext.onclick = function () {

        if(repeat){
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
        else if(random){
            var num=(Math.floor(Math.random() * 100))%(songs.length);
            while(num==current_track){
                num=(Math.floor(Math.random() * 100))%(songs.length);
            }
            console.log(current_track);
            console.log(num);
            console.log(songs.length);
            current_track=num;
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
        else{
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

    }



    mNext.onclick = function () {

        if(repeat){
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
        else if(random){
            var num=(Math.floor(Math.random() * 100))%(songs.length);
            while(num==current_track){
                num=(Math.floor(Math.random() * 100))%(songs.length);
            }
            console.log(current_track);
            console.log(num);
            console.log(songs.length);
            current_track=num;
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
        else{
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

    }


    cNext.onclick = function () {

        if(repeat){
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
        else if(random){
            var num=(Math.floor(Math.random() * 100))%(songs.length);
            while(num==current_track){
                num=(Math.floor(Math.random() * 100))%(songs.length);
            }
            console.log(current_track);
            console.log(num);
            console.log(songs.length);
            current_track=num;
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
        else{
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

    }


    /**
     * Funcion que actualiza la info del track seleccionado
     */
    function actualizarInfoWeb() {
        wTitle.textContent = song.name;
        wArtist.textContent = song.authorName;
        mTitle.textContent = song.name;
        mArtist.textContent = song.authorName;
        cTitle.textContent = song.name;
        cArtist.textContent = song.authorName;
        wArt.src = song.art;
        cArt.src = song.art;

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

    this.cambiarSongs1=function(canci,nombre,id) {
        console.log("cambio lista a"+ id);
        wList.textContent ='Lista: '+nombre;
        songs=canci;
        listID=id;
    }

    this.cambiarSongs2=function(canci,nombre) {
        wList.textContent ='Lista: '+nombre;
        songs=canci;
        listID="no";
    }


//Note: bins needs to be a power of 2
var displayBins = 2048;
var backgroundColour = "#ffffff";
var barColour = "#EC1A55";
var songFont = "15px 'Open Sans'";
//Where the bottom of the waveform is rendered at (out of 255). I recommend
//leaving it at 96 since it seems to work well, basically any volume will push
//it past 96. If your audio stream is quiet though, you'll want to reduce this.
var floorLevel = 96;

//Whether to draw the frequencies directly, or scale the x-axis logarithmically and show pitch instead.
var drawPitch = true;
//Whether to draw the visualisation as a curve instead of discrete bars
var drawCurved = true;
//If drawCurved is enabled, this flag fills the area beneath the curve (the same colour as the line)
var drawFilled = false;
//Whether to draw text the songText on top of the visualisation
var drawText = false;

//Can't touch this
var audioContext;
var audioBuffer;
var audioAnalyserNode;
var audioVisualizerInitialized = false;
var songText = "";
var textSize;
var canvasContext;
var canvasWidth;
var canvasHeight;
var multiplier;
var finalBins = [];
var logLookupTable = [];
var logBinLengths = [];
var binWidth;
var magicConstant = 42; //Meaning of everything. I don't know why this works.



function visu(canvasElement,audio) {
	//var file = URL.createObjectURL(files[0])
	/*
	audioElemen=new Audio();
	audioElemen.crossOrigin = "anonymous";
	audioElemen.src = '/home/sherrero/Escritorio/Proyecto/Web/cierzoAng/public/songs/llamada.mp3';
    audioElemen.play();*/
    console.log(canvasElement);
	initializeVisualizer(canvasElement, audio);


}





/**
 *  Inicializador del visualizador
 */
function initializeVisualizer(canvasElement, audioElement) {
	try {
		var ctxt = window.AudioContext || window.webkitAudioContext;
		if (ctxt) {
            console.log(canvasElement);
            initCanvas(canvasElement);

			audioContext = new ctxt();
			setupAudioApi(audioElement);
		}
	} catch(e) {
		console.log(e);
	}
}

function updateSongText(newText) {
	songText = newText;
	if (canvasContext)
		textSize = canvasContext.measureText(songText);
}

function setupAudioApi(audioElement) {

	var src = audioContext.createMediaElementSource(audioElement);


	audioAnalyserNode = audioContext.createAnalyser();
	//FFT node takes in 2 samples per bin, and we internally use 2 samples per bin
	audioAnalyserNode.fftSize = drawPitch ? displayBins * 8 : displayBins * 2;
	multiplier = Math.pow(22050, 1 / displayBins) * Math.pow(1 / magicConstant, 1 / displayBins);
	finalBins = [];
	logLookupTable = [];
	logBinLengths = [];
	for (var i = 0; i < displayBins; i++) {
		finalBins.push(0);
		logLookupTable.push(0);
	}
	createLookupTable(audioAnalyserNode.frequencyBinCount, logBinLengths, logLookupTable);
	binWidth = Math.ceil(canvasWidth / (displayBins - 1));

	src.connect(audioAnalyserNode);

	audioAnalyserNode.connect(audioContext.destination);


	audioVisualizerInitialized = true;
}

function initCanvas(canvasElement) {
	canvasContext = canvasElement.getContext('2d');
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	requestAnimationFrame(paint);
	canvasContext.font = songFont;
	canvasContext.strokeStyle = barColour;

	textSize = canvasContext.measureText(songText);
}

//Render some fancy bars
function paint() {
	requestAnimationFrame(paint);

	if(!audioVisualizerInitialized)
		return;

	canvasContext.fillStyle = backgroundColour;
	canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

	var bins = audioAnalyserNode.frequencyBinCount;
	var data = new Uint8Array(bins);
	audioAnalyserNode.getByteFrequencyData(data);
	canvasContext.fillStyle = barColour;

	if (drawPitch)
		updateBinsLog(logLookupTable, data);
	else
		updateBins(bins, logBinLengths, data);

	if (!drawCurved) {
		for (var i = 0; i < displayBins; i++) {
			paintSingleBin(i);
		}
	} else {
		canvasContext.fillStyle = barColour;
		canvasContext.beginPath();
		canvasContext.moveTo(0, canvasHeight - getBinHeight(0));
		var i;
		for (i = 0; i < displayBins - 2;) {
			var thisX = i * binWidth;
			var nextX = (i + logBinLengths[i]) * binWidth; //First subbin of the next bin
			var x = (thisX + nextX) / 2;

			var thisY = canvasHeight - getBinHeight(i);
			var nextY = canvasHeight - getBinHeight(i + logBinLengths[i]);
			var y = (thisY + nextY) / 2;

			canvasContext.quadraticCurveTo(thisX, thisY, x, y);

			i += logBinLengths[i];
		}
		canvasContext.quadraticCurveTo(i * binWidth, canvasHeight - getBinHeight(i), (i + 1) * binWidth, canvasHeight - getBinHeight(i + 1));
		if (drawFilled) {
			canvasContext.lineTo(canvasWidth, canvasHeight);
			canvasContext.lineTo(0, canvasHeight);
			canvasContext.fill();
		} else {
			canvasContext.stroke();
		}
	}

	if (drawText) {
		canvasContext.fillStyle = 'white';
		//Note: the 15's here need to be changed if you change the font size
		canvasContext.fillText(songText, canvasWidth / 2 - textSize.width / 2, canvasHeight / 2 - 15 / 2 + 15);
	}
}

//Inclusive lower, exclusive upper except with stop == start
function averageRegion(data, start, stop) {
	if (stop <= start)
		return data[start];

	var sum = 0;
	for (var i = start; i < stop; i++) {
		sum += data[i];
	}
	return sum / (stop - start);
}

function updateBins(bins, binLengths, data) {
	var step = bins / displayBins;
	for (var i = 0; i < displayBins; i++) {
		var lower = i * step;
		var upper = (i + 1) * step - 1;
		var binValue = averageRegion(data, lower, upper);
		binLengths.push(1);
		finalBins[i] = binValue;
	}
}

function createLookupTable(bins, binLengths, lookupTable) {
	if (drawPitch) {
		var lastFrequency = magicConstant / multiplier;
		var currentLength = 0;
		var lastBinIndex = 0;
		for (var i = 0; i < displayBins; i++) {
			var thisFreq = lastFrequency * multiplier;
			lastFrequency = thisFreq;
			var binIndex = Math.floor(bins * thisFreq / 22050);
			lookupTable[i] = binIndex;
			currentLength++;

			if (binIndex != lastBinIndex) {
				for (var j = 0; j < currentLength; j++)
					binLengths.push(currentLength);
				currentLength = 0;
			}

			lastBinIndex = binIndex;
		}
	} else {
		for (var i = 0; i < displayBins; i++) {
			lookupTable[i] = i;
		}
	}
}

function updateBinsLog(lookupTable, data) {
	for (var i = 0; i < displayBins; i++) {
		finalBins[i] = data[lookupTable[i]];
	}
}

function getBinHeight(i) {
	var binValue = finalBins[i];

	//Pretty much any volume will push it over [floorLevel] so we set that as the bottom threshold
	//I suspect I should be doing a logarithmic space for the volume as well
	var height = Math.max(0, (binValue - floorLevel));
	//Scale to the height of the bar
	//Since we change the base level in the previous operations, 256 should be changed to 160 (i think) if we want it to go all the way to the top
	height = (height / (256 - floorLevel)) * canvasHeight * 0.8;
	return height;
}

function paintSingleBin(i) {
	var height = getBinHeight(i);
	canvasContext.fillRect(i * binWidth, canvasHeight - height, binWidth, height);
}






}]);
