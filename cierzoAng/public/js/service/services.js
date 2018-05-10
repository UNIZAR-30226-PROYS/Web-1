cierzoApp = angular.module('cierzoApp', ["ngRoute"]);

cierzoApp.service('datos', function(){
    var dato='http://localhost:2595/canciones';

    this.setListaS = function(a) {
        console.log(a)
        dato=a;
     }

    this.getData = function() {
        console.log(dato.link);
        return dato;
    }

});


