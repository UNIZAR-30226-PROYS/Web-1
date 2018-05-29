var server='http://192.168.44.128:8080/api/';



function existe(l,va){
    for(var i=0;i<l.length;i++){
        if(l[i].id==va.id){
            return true;
        }
    }
    return false;
}


function getArtists(listaC){
    var artists=[];
    for(var i=0;i<listaC.length;i++){
        var meter={
            name: listaC[i].authorName,
            id: listaC[i].authorID
        };
        if(!existe(artists,meter)){
            artists.push(meter);
        }

    }
    return artists;
}


function getAlbums(listaC){
    var artists=[];
    for(var i=0;i<listaC.length;i++){
        var meter={
            name: listaC[i].albumName,
            id: listaC[i].albumID
        };
        if(!existe(artists,meter)){
            artists.push(meter);
        }

    }
    return artists;
}



cierzoApp.controller("principalController", ['$scope','$location','$cookieStore', function ($scope,$location,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";
    $scope.usuario=$cookieStore.get('nombre');

    $scope.$on('$locationChangeSuccess', function(event){
        $scope.usuario=$cookieStore.get('nombre');
        var pa=$location.url();
        pa=pa.split("/");
        if($location.url()=='/big'){
            $scope.repro='big';
        }
        else if($location.url()=='/login' || $location.url()=='/' || $location.url()=='/sign' || $location.url()=='/admin'  || $location.url()=='/user' || $location.url()=='/crear' || $location.url()=='/big' || pa[1]=='modif'  ){
            $scope.repro='no';
        }
        else{
            $scope.repro='si';
        }
    })


    $scope.hola = function(){
        //alert($scope.busq);
        $location.path('/search/'+$scope.busq);
    }

    $scope.hola2 = function(){
        //alert($scope.cadena);
        $location.path('/search/'+$scope.cadena);
    }
}]);

var canciones=[];
var nLista='';

cierzoApp.controller("songsController", ['$scope', '$routeParams','$http','music','$cookieStore', function($scope, $routeParams,$http,music,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";

    var lis=''
    var param = $routeParams.param1;
    if(param==undefined){
        $scope.titulo='Todas';
        var url2=server+'profiles/'+$cookieStore.get('id')
    }
    else if(param=='album'){
        var param2 = $routeParams.param2;
        var url2=server+'albums/'+param2;
    }
    else{
        var url2=server+'playlists/'+param;
    }


    $http({
        method: 'GET',
        url: url2
    }).then(function successCallback(response) {

        if(param==undefined){
            var lis=response.data.playlists[0];
            canciones=lis.songs;
            $scope.titulo='Lista: Favoritas';
            nLista='Todas';

        }
        else if(param=='album'){
            var lis=response.data;
            canciones=lis.songs;

            nLista=lis.name;
            $scope.titulo='Album: '+nLista+' de '+lis.authorName;
        }
        else{
            var lis=response.data;

            nLista=lis.name;
            canciones=lis.songs;
            $scope.titulo='Lista: '+nLista;

        }

        $scope.canciones=canciones;

        //reproducir cancion desde /songs
        //hacer llamada con num=id cancion y reproducir en funcion de la posicion.
        $scope.prueba = function(num,lista) {
            music.cambiarSongs(lista,nLista);
            music.playSongId(num);
        }


    }, function errorCallback(response) {

    });

    $scope.ordenNombre = function() {
        var lista=$scope.canciones;
        lista.sort(function(a, b){return a.name>b.name})
        console.log(lista);
    }

    $scope.ordenNormal = function() {
        var lista=$scope.canciones;
        lista.sort(function(a, b){return a.name<b.name})
        $scope.canciones=lista;
        console.log(lista);
    }


}]);

cierzoApp.controller("artistsController", ['$scope','$http','$cookieStore', function ($scope,$http,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";

    $http({
        method: 'GET',
        url: server+'profiles/'+$cookieStore.get('id')
    }).then(function successCallback(response) {
        var artists=getArtists(response.data.playlists[0].songs);
        for(var i=0;i<artists.length;i++){
            artists[i]['imagen']=server+'authors/'+artists[i].id+'/image';
        }


        $scope.artists=artists;
    }, function errorCallback(response) {
    });

    $scope.artists=artists;

}]);


cierzoApp.controller("bigController", ['$scope','$http','$cookieStore', function ($scope,$http,$cookieStore) {


}]);



cierzoApp.controller("albumsController", ['$scope','$http','$routeParams','$cookieStore', function ($scope,$http,$routeParams,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";



    var param = $routeParams.param1;
    if(param==undefined){
        $scope.titulo='Todas';
        var urlb=server+'profiles/'+$cookieStore.get('id');
    }
    else{
        var urlb=server+'authors/'+param;
    }

    $http({
        method: 'GET',
        url: urlb
    }).then(function successCallback(response) {

        if(param==undefined){
            var albums=getAlbums(response.data.playlists[0].songs);
        }
        else{
            var albums=response.data.albums;
        }

        for(var i=0;i<albums.length;i++){
            albums[i]['imagen']=server+'albums/'+albums[i].id+'/image';
        }


        $scope.albums=albums;
    }, function errorCallback(response) {
    });

}]);

cierzoApp.controller("searchController", ['$scope','$routeParams','$http','music', function ($scope,$routeParams,$http,music) {

    $scope.bu=$routeParams.param;
    $http({
        method: 'GET',
        url: server+'songs?name='+$routeParams.param
    }).then(function successCallback(response) {
        $scope.canciones=response.data;

    }, function errorCallback(response) {

    });

    $http({
        method: 'GET',
        url: server+'authors?name='+$routeParams.param
    }).then(function successCallback(response) {
        $scope.artists=response.data;

    }, function errorCallback(response) {

    });

    $http({
        method: 'GET',
        url: server+'albums?name='+$routeParams.param
    }).then(function successCallback(response) {
        $scope.albums=response.data;

    }, function errorCallback(response) {

    });


    $http({
        method: 'GET',
        url: server+'songs?genre='+$routeParams.param
    }).then(function successCallback(response) {
        $scope.cancionesG=response.data;

    }, function errorCallback(response) {

    });

    $scope.prueba = function(num,lista) {
        var nueva=[lista];
        music.cambiarSongs(nueva,"");
        music.playSongId(num);
    }

}]);

cierzoApp.controller("listasRepController", ['$scope','$http','$cookieStore', function ($scope,$http,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";

    $http({
        method: 'GET',
        url: server+'profiles/'+$cookieStore.get('id')
    }).then(function successCallback(response) {

        var listas=response.data.playlists;

        for(var i=0;i<listas.length;i++){
            if(listas[i].songs.length==0){
                listas[i]['imagen']="images/fondoPlaylistVacia.png";
            }
            else{
                listas[i]['imagen']=server+'songs/'+listas[i].songs[0].id+'/image';
            }

        }

        $scope.listas=listas;
    }, function errorCallback(response) {

    });

}]);



cierzoApp.controller("cambiarController", ['$scope','$http','$cookieStore', function ($scope,$http,$cookieStore) {
    var id=$cookieStore.get('id');

    $scope.cambio = function(){
        if($scope.pass1==$scope.pass12){
            var data1={
                "mail": $scope.mail1.toString(),
                "pass": $scope.pass1.toString()
            }
            $http({
                method: 'PUT',
                url: server+'account/credentials',
                data: data1
            }).then(function successCallback(response) {
                alert("Has cambiado correctamente.")
               
            }, function errorCallback(response) {
        
            });
            //alert("cambio user "+id+" nuevo correo "+$scope.mail+" nuevo pass "+$scope.pass1);
        }
        else{
            alert("Las contraseñas tienen que ser identicas");
        }
    }

}]);



cierzoApp.controller("usersController",['$scope','$http','$cookieStore', function ( $scope,$http,$cookieStore) {
    $scope.headerSrc = "tmpl/navbar.html";
    var finUrl=$cookieStore.get('id');
    var users=[];
    $scope.users=users;
    $http({
        method: 'GET',
        url: server+'profiles/'+finUrl
    }).then(function successCallback(response) {
        $scope.amigos=response.data.friends;
    }, function errorCallback(response) {

    });

    $scope.add = function(id){
        alert("añado user "+id);

        $http({
            method: 'POST',
            url: server+'profiles/'+id+'/follow'
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
    
        });

    }

    $scope.eliminar = function(id){

        $http({
            method: 'DELETE',
            url: server+'profiles/'+id+'/follow'
        }).then(function successCallback(response) {
            alert("eliminado user "+id);
        }, function errorCallback(response) {
    
        });


        

    }

    $scope.buscar = function(id){
        $http({
            method: 'GET',
            url: server+'profiles?name='+id
        }).then(function successCallback(response) {
            $scope.users=response.data;
        }, function errorCallback(response) {

        });

    }


}]);



cierzoApp.controller("crearlController",['$scope','$http', function ( $scope,$http) {
    var nuevas=[];
    $scope.num=0;
    $scope.nameL2="Lista nueva";
    $http({
        method: 'GET',
        url: server+'songs?limit=50'
    }).then(function successCallback(response) {
        $scope.todas=response.data;
    }, function errorCallback(response) {

    });

    $scope.addS = function(id){
        nuevas.push(id);
        $scope.num=$scope.num+1;
        $scope.nuevas=nuevas;
    }

    $scope.quitarS = function(id){
        nuevas.splice(id, 1);
        $scope.num=$scope.num-1;
        $scope.nuevas=nuevas;
    }

    $scope.crear = function(){

        if($scope.nameL==undefined || nuevas.length==0){
            alert("No se puede crear.")
        }
        else{
            var datos={
                "description": "Descripción de la nueva lista",
                "name": $scope.nameL
              }
            $http({
                method: 'POST',
                url: server+'playlists',
                data: datos
            }).then(function successCallback(response) {

                
            }, function errorCallback(response) {
        
            });

            console.log("Se crea la lista:")
            console.log($scope.nameL);
            console.log(nuevas);
        }

    }


}]);



cierzoApp.controller("modifController",['$scope','$http','$routeParams', function ( $scope,$http,$routeParams) {
    var nuevas=[];
    $scope.num=0;

    $http({
        method: 'GET',
        url: server+'playlists/'+$routeParams.param
    }).then(function successCallback(response) {
        nuevas=response.data.songs;
        $scope.nuevas=nuevas;
        $scope.num=nuevas.length;
        $scope.nameL2=response.data.name;
    }, function errorCallback(response) {

    });



    $http({
        method: 'GET',
        url: server+'songs?limit=50'
    }).then(function successCallback(response) {
        $scope.todas=response.data;
    }, function errorCallback(response) {

    });

    $scope.addS = function(id){
       
        $http({
            method: 'POST',
            url: server+'playlists'+$routeParams.param+'/songs',
            data: "\""+id.id+"\""
        }).then(function successCallback(response) {
            nuevas.push(id);
            $scope.num=$scope.num+1;
            $scope.nuevas=nuevas;
        }, function errorCallback(response) {
            alert("Algo ha ido mal");
        });

    }

    $scope.quitarS = function(id,ind){
        console.log(id);
        $http({
            method: 'DELETE',
            url: server+'playlists/'+$routeParams.param+'/songs/'+id,
        }).then(function successCallback(response) {
            nuevas.pop(ind);
            $scope.num=$scope.num-1;
            $scope.nuevas=nuevas;
        }, function errorCallback(response) {
            alert("Algo ha ido mal");
        });
    }

    $scope.crear = function(){
       
        if($scope.nameL==undefined){
            alert("No se puede modificar.")
        }
        else{
            var datos={
                "description": "Descripción de la nueva lista",
                "name": $scope.nameL
              }
            $http({
                method: 'PUT',
                url: server+'playlists/'+$routeParams.param,
                data: datos
            }).then(function successCallback(response) {
                alert("Se modifica");
                
            }, function errorCallback(response) {
        
            });

            
        }

    }


    $scope.eliminar = function(){
        $http({
            method: 'DELETE',
            url: server+'playlists/'+$routeParams.param
        }).then(function successCallback(response) {
            alert("Se BORRA");
            
        }, function errorCallback(response) {
    
        });
        
    }


}]);



cierzoApp.controller("loginController",['$scope','$cookieStore', 'authProvider', '$location','$http', function ($scope,$cookieStore,authProvider,$location,$http) {


    $scope.loginn = function() {
        if($scope.nick2!=undefined && $scope.pass2!=undefined){

            if($scope.nick2=='root' && $scope.pass2=='toor' ){

                authProvider.setUser(true);
                $location.path('/songs');
                $cookieStore.put("conectado", true);
                $cookieStore.put("id", 'id'+$scope.nick2);
            }
            else{

                var data2={
                    "mail": $scope.nick2,
                    "pass": $scope.pass2
                  }



                $http({
                    method: 'POST',
                    //withCredentials: true ,
                    url: server+'login',
                    data: data2
                }).then(function successCallback(response) {
                    authProvider.setUser(true);
                    $cookieStore.put("conectado", true);
                    $cookieStore.put("nombre",$scope.nick2);
                    $cookieStore.put("id", response.data.id);
                    var id=response.data.id;
                    $location.path('/songs');


                }, function errorCallback(response) {

                    alert("Error en login");
                });

            }

        }
    }




}]);

cierzoApp.controller("signController",['$scope','$http','$location', function ($scope,$http,$location) {



    $scope.sign = function(){

        if($scope.pass1!=$scope.pass12){
            alert("Las contraseñas no coinciden")
        }
        else{
            var data3={
                "mail": $scope.mail1,
                "name": $scope.name1,
                "pass": $scope.pass1,
                "username": $scope.sur1
              }

            console.log(data3);
            $http({
                method: 'POST',
                url: server+'signup',
                data: data3
            }).then(function successCallback(response) {
                alert("Te has registrado, ahora entra.");
                $location.path('/login');


            }, function errorCallback(response) {
                alert("No has podido registrarte");
            });
        }
    }


}]);




cierzoApp.controller("userController", ['$scope','$http','$cookieStore','authProvider','$location','$routeParams', function ($scope,$http,$cookieStore,authProvider,$location,$routeParams) {

    var param=$routeParams.param;

    if(param==undefined){
        var finUrl=$cookieStore.get('id');
    }
    else{
        var finUrl=param;
    }
    $http({
        method: 'GET',
        url: server+'profiles/'+finUrl
    }).then(function successCallback(response) {
        $scope.user=response.data;


    }, function errorCallback(response) {

    });

    $scope.salir = function() {
        authProvider.setUser(false);
        $cookieStore.put("conectado", false);
        $cookieStore.remove("nombre");
        $cookieStore.remove("id");
        $location.path('/songs');
    }


    $scope.borrar = function() {
        
        

        $http({
            method: 'DELETE',
            url: server+'account'
        }).then(function successCallback(response) {
            authProvider.setUser(false);
            $cookieStore.put("conectado", false);
            $cookieStore.remove("nombre");
            $cookieStore.remove("id");
            $location.path('/songs');
           
        }, function errorCallback(response) {

        });

    }

}]);




cierzoApp.controller("adminController",['$scope','$http','$location', function ($scope,$http,$location) {


    /* SCRIPT que controla el panel de administrador */

    var enviarCancion   = document.getElementById('envioCancion'); //Boton enviarCancion
    var enviarAlbum     = document.getElementById('envioAlbum'); //Boton envioAlbum
    var modifTitulo     = document.getElementById('modTitulo'); //Boton mod Titulo
    var modifAlbum      = document.getElementById('modAlbum'); //Boton modificoAlbum
    var modifAutor      = document.getElementById('modArtista'); //Boton modificoAutor
    var eliminarCancion = document.getElementById('eliminarSong'); // Boton eliminarCancion
    var eliminarAlbum   = document.getElementById('eliminarAlbum'); // Boton eliminarAlbum
    var eliminarArtista = document.getElementById('eliminarAutor'); // Boton eliminarAutor


    /***************************************************************************/
    /********************* INSERTAR FICHEROS ***********************************/
    /***************************************************************************/

    var iden;
    $scope.enviar=function(){
        alert("intento enviar");
        console.log($scope.archivo);
        $http({
            method: 'POST',
            url: server+'songs/56/file',
            data: $scope.archivo
        }).then(function successCallback(response) {
            alert('envio');
            console.log($scope.archivo);
            
        }, function errorCallback(response) {
            
        });
    }
    /**
     * Cuando el boton enviarCancion es pulsado
     */
    enviarCancion.onclick = function () {
        var titulo  = document.getElementById("a_title").value;
        var artista = document.getElementById("a_artista").value;
        var album   = document.getElementById("a_album").value;
        var fors   = document.getElementById("fofof");

        /*
        var fichero = document.getElementById("a_file").value;


        var fichero_url = document.getElementById("a_file");
        var file = fichero_url.files[0];
        var formData = new FormData();
        formData.append('songFile',fichero,"pepe.mp3");
        
       console.log(formData);
        */
        var genero  = document.getElementById("a_genero").value;
        

        // Subir cancion
        var data1={
            "albumID": album,
            "authorID": artista,
            "genre": [genero],
            "lenght": "150",
            "name": titulo
        };
        console.log(data1);
        $http({
            method: 'POST',
            url: server+"songs",
            data: data1
        }).then(function successCallback(response) {
            alert('creo Song, ahora envia el archivo');
            
            fors.action=server+'songs/'+response.data.id+'/file';
            fors.submit();
            iden=response.data.id;
            //$scope.actionURL=server+'songs/'+response.data.id+'/file';
            //console.log($scope.actionURL);

            
    
            
        },function errorCallback(response) {
            
        });
        


       
        /*
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", server+"songs", true);
        xmlhttp.withCredentials=true;
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        var data={
            "\"albumID\"": album.toString(),
            "\"authorID\"": artista.toString(),
            "\"genre\"": [genero.toString()],
            "\"lenght\"": "03:05",
            "\"name\"": titulo
        };
        console.log(data);
        xmlhttp.send(data);

        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
            alert('Cancion añadida!');
            console.log("Añadida cancion--->");
            console.log("Titulo : " + titulo);
            console.log("Artista: " + artista);
            console.log("Album  : " + album);
            console.log("File   : " + fichero);

            //Subir fichero
            var cancion = JSON.parse(xmlhttp.responseText); //para obtener el id
            xmlhttp.open("POST", server+"songs/"+cancion.id+"/file", false);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(formData);

            //Limpio los campos
            document.getElementById("a_title").value = "";
            document.getElementById("a_artista").value = "";
            document.getElementById("a_album").value = "";
            document.getElementById("a_file").value = "";
            document.getElementById("a_file2").value = "";
            document.getElementById("a_genero").value = "";
        }else{
            alert('No he podido: ' + xmlhttp.statusText);
            console.log("Problemas...");
            console.log(xmlhttp.statusText);
        }
*/
    }
    /**
     * Cuando el boton enviar2 es pulsado
     */
    enviarAlbum.onclick = function(){
        var titulo  = document.getElementById("al_title").value;
        var artista = document.getElementById("al_artista").value;
        var desc    = document.getElementById("al_desc").value;
        var publi   = document.getElementById("al_time").value;
        // Subir album
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("POST", server+"albums", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.withCredentials=true;
        xmlhttp.send(JSON.stringify({"authorID": artista, "description": desc,
                                    "name": titulo, "publishDate": publi+"T00:00:00.000Z"}));

        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
            alert('Album añadido!');
            console.log("Añadida album--->");
            console.log("Titulo : " + titulo);
            console.log("Artista: " + artista);
            console.log("Desc   : " + desc);
            console.log("public : " + publi);
            //Limpio los campos
            document.getElementById("al_title").value = "";
            document.getElementById("al_artista").value = "";
            document.getElementById("al_desc").value = "";
            document.getElementById("a_time").value = "";
        }else{
            alert('No he podido: ' + xmlhttp.statusText);
            console.log("Problemas...");
            console.log(xmlhttp.statusText);
        }
    }

    /***************************************************************************/
    /********************* MODIFICAR CANCION ***********************************/
    /***************************************************************************/


    function getDatosSong(id){
        $http({
            method: 'GET',
            url: server+"songs/"+id
        }).then(function successCallback(response) {
            console.log(response.data);
            return response.data;

           
        }, function errorCallback(response) {
            alert("No existe ese id..");
        });
    }


    /*
    * Boton modificar titulo pulsado
    */
    modifTitulo.onclick = function(){

        var idSong = document.getElementById("ca_Idsong").value;
        var titulo = document.getElementById("ca_title").value;
        
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("GET", server+"songs/"+idSong, false);
        xmlhttp.send(null);
        if (xmlhttp.status == 200){
            var cancion = JSON.parse(xmlhttp.responseText);
            var min = "0" + Math.trunc(parseInt(cancion.lenght)/60);
            var sec = function(){
                if(Math.trunc(parseInt(cancion.lenght)%60) < 10){
                    return "0" + Math.trunc(parseInt(cancion.lenght)%60);
                }else{
                    return Math.trunc(parseInt(cancion.lenght)%60);
                }
            };
            var tiempo=min+":"+sec();
            //xmlhttp.setRequestHeader("Content-Type", "application/json");
            var data1={
                "albumID": cancion.albumID.toString(),
                "authorID": cancion.authorID.toString(),
                "genre": cancion.genre,
                "lenght": cancion.lenght.toString(),
                "name": titulo
            };
            console.log(data1);
            $http({
                method: 'PUT',
                url: server+"songs/"+idSong,
                data: data1
            }).then(function successCallback(response) {
                console.log(response.data);
    
               
            }, function errorCallback(response) {
                alert("DEP");
            });

        }else{
            alert('Algo ha ido mal...');
        }
        

    }

    /*
    * Boton modificar album pulsado
    */
    modifAlbum.onclick = function(){
    var albumID = document.getElementById("ca_album").value;
    var albumNa = document.getElementById("ca_albumna").value;
    var idSong = document.getElementById("ca_Idsong2").value;
    console.log(idSong);

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("GET", server+"songs/"+idSong, false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200){
        var cancion = JSON.parse(xmlhttp.responseText);
        /*
        var min = "0" + Math.trunc(parseInt(cancion.lenght)/60);
        var sec = function(){
        if(Math.trunc(parseInt(cancion.lenght)%60) < 10){
            return "0" + Math.trunc(parseInt(cancion.lenght)%60);
        }else{
            return Math.trunc(parseInt(cancion.lenght)%60);
        }};
        xmlhttp.open("PUT", server+"songs/"+idSong, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"albumID":albumID.toString(),"albumName":albumNa,"authorID":cancion.authorID.toString(),
                                    "authorName":cancion.authorName,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                    "name":cancion.name}));


        */
        var data1={
            "albumID": albumID,
            "authorID": cancion.authorID.toString(),
            "genre": cancion.genre,
            "lenght": cancion.lenght.toString(),
            "name": cancion.name
        };
        //console.log(data1);
        $http({
            method: 'PUT',
            url: server+"songs/"+idSong,
            data: data1
        }).then(function successCallback(response) {
            console.log(response.data);

            var data1="'"+idSong+"'";
            console.log(data1);
            $http({
                method: 'POST',
                url: server+"albums/"+albumID+'/songs',
                data: data1
            }).then(function successCallback(response) {
                console.log(response.data);
    
                
            }, function errorCallback(response) {
                alert("DEP");
            });


            
            
        }, function errorCallback(response) {
            alert("DEP");
        });
        /*
        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Info cambiada!');

        //Limpio los campos
        document.getElementById("ca_album").value = "";
        document.getElementById("ca_albumna").value = "";
        document.getElementById("ca_Idsong").value = "";

        }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
        }
        */
    }else{
        alert('Algo ha ido mal...');
    }
    }

    /*
    * Boton modificar autor pulsado
    */
    modifAutor.onclick = function(){
    var autorID = document.getElementById("ca_artist").value;
    var autorNa = document.getElementById("ca_artistna").value;
    var idSong = document.getElementById("ca_Idsong").value;

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("GET", server+"songs/"+idSong, false);
    xmlhttp.send(null);
    if (xmlhttp.status == 200){
        var cancion = JSON.parse(xmlhttp.responseText);
        var min = "0" + Math.trunc(parseInt(cancion.lenght)/60);
        var sec = function(){
        if(Math.trunc(parseInt(cancion.lenght)%60) < 10){
            return "0" + Math.trunc(parseInt(cancion.lenght)%60);
        }else{
            return Math.trunc(parseInt(cancion.lenght)%60);
        }};
        xmlhttp.open("PUT", server+"songs/"+idSong, false);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({"albumID":cancion.albumID.toString(),"albumName":cancion.albumName,"authorID":autorID.toString(),
                                    "authorName":autorNa,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                    "name":cancion.name}));

        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
        alert('Info cambiada!');

        //Limpio los campos
        document.getElementById("ca_artist").value = "";
        document.getElementById("ca_artistna").value = "";
        document.getElementById("ca_Idsong").value = "";

        }else{
        alert('No he podido: ' + xmlhttp.statusText);
        console.log("Problemas...");
        console.log(xmlhttp.statusText);
        }
    }else{
        alert('Algo ha ido mal...');
    }
    }


    /***************************************************************************/
    /********************* ELIMINAR FICHEROS ***********************************/
    /***************************************************************************/


    /**
     * Cuando el boton eliminarCancion es pulsado
     */
    eliminarCancion.onclick = function () {
        var idSong = document.getElementById("el_Idsong").value;
        /*
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("DELETE", server+"songs/"+idSong, false);
        xmlhttp.withCredentials=true;
        xmlhttp.send();
        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
            xmlhttp.open("DELETE", server+"songs/"+idSong+"file", false);
            xmlhttp.send();

            alert('Cancion eliminada!');
            //Limpio los campos
            document.getElementById("el_Idsong").value = "";

        }else{
            alert('No he podido: ' + xmlhttp.statusText);
            console.log("Problemas...");
            console.log(xmlhttp.statusText);
        }
        */

       $http({
            method: 'DELETE',
            url: server+"songs/"+idSong
        }).then(function successCallback(response) {
            console.log(response.data);

            
        }, function errorCallback(response) {
            alert("DEP");
        });
    }

    /**
     * Cuando el boton eliminarAlbum es pulsado
     */
    eliminarAlbum.onclick = function () {
        var idAlbum = document.getElementById("el_Idalbum").value;
        
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.open("DELETE", server+"albums/"+idAlbum, false);
        xmlhttp.withCredentials=true;
        xmlhttp.send();
        if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
            alert('Album eliminado!');
            //Limpio los campos
            document.getElementById("el_Idalbum").value = "";

        }else{
            alert('No he podido: ' + xmlhttp.statusText);
            console.log("Problemas...");
            console.log(xmlhttp.statusText);
        }
    }

    /**
     * Cuando el boton eliminarAlbum es pulsado
     */
    eliminarArtista.onclick = function () {
    alert('No se puede eliminar artista..');
    document.getElementById("el_Idautor").value = "";
    }


}]);
