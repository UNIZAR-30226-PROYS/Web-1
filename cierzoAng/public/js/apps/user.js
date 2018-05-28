/* SCRIPT que controla el panel del usuario */

var nombreUsuario      = document.getElementById('nombreUser'); //Boton enviarCancion
var usuarioUsuario     = document.getElementById('usuarioUser'); //Boton envioAlbum
var emailUsuario       = document.getElementById('emailUser'); //Boton mod Titulo
var descUsuario        = document.getElementById('descUser'); //Boton mod Titulo


window.onload = function() {
  var datos = cargarDatosUsuario(); //Funcion que carga los datos del usuario
  cargarAmigos(datos);
  cargarPlaylist(datos);
};


/*
 * Carga los datos del usuario y los muestra
*/
function cargarDatosUsuario(){
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  /* LLamada a la API */
  xmlhttp.open("GET", "http://localhost:8080/api/account", false);
  xmlhttp.send(null);
  if (xmlhttp.status == 200){ //Si ha ido bien
    var datos = JSON.parse(xmlhttp.responseText);
    console.log(xmlhttp.responseText);
    nombreUsuario.textContent = datos.name;
    usuarioUsuario.textContent = datos.username;
    emailUsuario.textContent = datos.mail;
    descUsuario.textContent   = datos.bio;
    return datos;
  }else{
    console.log('Algo ha ido mal...');
    console.log(xmlhttp.statusText);
    return -1;
  }
}


/*
 * Carga los datos de los AMIGOS
 * datos es un JSON con los datos del usuario
 */
 function cargarAmigos(datos){
   var listaAmigos = document.getElementById("listaAmigos"); //Lista

   var i = 0;
   for (amigo in datos.friends) { //De toda la lista de amigos
     var amigos = document.createElement('li'); //Nuevo elemento a insertar
     repro.className = "collection-item avatar";

     var logo = document.createElement('img');
     logo.src = "images/logo.png"; logo.className="circle";

     var nombre = document.createElement('h5');
     nombre.className ="amigo"+i; nombre.textContent=amigo.name;

     var desc = document.createElement('span');
     desc.className="descAmigo"+i; desc.textContent=amigo.bio;
     /* Añado a la lista*/
     amigo.appendChild(logo);amigo.appendChild(nombre);amigo.appendChild(desc);
     listaAmigos.appendChild(amigo);
     i = i+1;
   }
 }

 /*
  * Carga los datos de los AMIGOS
  * datos es un JSON con los datos del usuario
  */
  function cargarPlaylist(datos){
    var listaRepro = document.getElementById("listaRepro"); //Lista

    var i = 0;
    for (play in datos.playlist) { //De toda la lista de amigos
      var repro = document.createElement('li'); //Nuevo elemento a insertar
      repro.className = "collection-item avatar";

      var logo = document.createElement('img');
      logo.src = "images/logo.png"; logo.className="circle";

      var nombre = document.createElement('h5');
      nombre.className ="playlist"+i; nombre.textContent=play.name;

      var desc = document.createElement('span');
      desc.className="descPlay"+i; desc.textContent=play.description;
      /* Añado a la lista*/
      repro.appendChild(logo);repro.appendChild(nombre);repro.appendChild(desc);
      listaRepro.appendChild(repro);
      i = i+1;
    }

  }
