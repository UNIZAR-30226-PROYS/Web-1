cierzoApp.controller("principalController", ['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
}]);



cierzoApp.controller("songsController", ['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";

    /*
    var x = document.getElementById("artists");   
    x.classList.add("active"); 

    */

    var dato=datos.getData();
    console.log(dato);

    //CONSULTA A LA API
    var xhr = new XMLHttpRequest();
    xhr.open("GET", dato, false);
    xhr.send();
    //FIN CONSULTA
    
    canciones=JSON.parse(xhr.responseText);

    for(var i=0;i<canciones.length;i++){
        canciones[i]["position"]=i;
    }

    $scope.prueba = function(num) {
        song = canciones[num];
        audio.src = song.url;
        audio.onloadeddata = function() {
            actualizarInfoWeb();
            actualizarInfoMovil();
        }
    }
    


    $scope.canciones=canciones;
    console.log("songs");
}]);

cierzoApp.controller("artistsController", ['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
    console.log("artists");
}]);

cierzoApp.controller("albumsController", ['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
    console.log("albums");
}]);

cierzoApp.controller("genresController", ['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
    console.log("genres");
}]);

cierzoApp.controller("listasRepController", ['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:2595/lista", false);
    xhr.send();
    //FIN CONSULTA
    
    listas=JSON.parse(xhr.responseText);

    //$scope.setLista = datos.setLista;

    $scope.setLista = function(num) {
        datos.setListaS(num);
    }

    $scope.listas=listas;

}]);



cierzoApp.controller("peopleController",['datos', '$scope', function (datos, $scope) {
    $scope.headerSrc = "tmpl/navbar.html";
}]);



