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

/**
 * Cuando el boton enviarCancion es pulsado
 */
enviarCancion.onclick = function () {
  var titulo  = document.getElementById("a_title").value;
  var artista = document.getElementById("a_artista").value;
  var album   = document.getElementById("a_album").value;
  var fichero_url = document.getElementById("a_file");
  var file = fichero_url.files[0];
  var formData = new FormData();
  formData.append('file',file);
  var fichero = document.getElementById("a_file").value;
  var genero  = document.getElementById("a_genero").value;
  console.log(fichero);
  // Subir cancion
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  xmlhttp.open("POST", "http://localhost:8080/api/songs", false);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify({"albumID": album, "authorID": artista,
                               "genre": ["rock"], "lenght": "01:10","name": titulo}));

  if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
    alert('Cancion añadida!');
    console.log("Añadida cancion--->");
    console.log("Titulo : " + titulo);
    console.log("Artista: " + artista);
    console.log("Album  : " + album);
    console.log("File   : " + fichero);

    //Subir fichero
    var cancion = JSON.parse(xmlhttp.responseText); //para obtener el id
    xmlhttp.open("POST", "http://localhost:8080/api/songs/"+cancion.id+"/file", false);
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
  xmlhttp.open("POST", "http://localhost:8080/api/albums", false);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
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

/*
 * Boton modificar titulo pulsado
 */
modifTitulo.onclick = function(){
  var titulo = document.getElementById("ca_title").value;
  var idSong = document.getElementById("ca_Idsong").value;

  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  xmlhttp.open("GET", "http://localhost:8080/api/songs/"+idSong, false);
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
    xmlhttp.open("PUT", "http://localhost:8080/api/songs/"+idSong, false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({"albumID":cancion.albumID.toString(),"albumName":cancion.albumName,"authorID":cancion.authorID.toString(),
                                 "authorName":cancion.authorName,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                 "name":titulo}));

    if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
      alert('Info cambiada!');

      //Limpio los campos
      document.getElementById("ca_title").value = "";
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

/*
 * Boton modificar album pulsado
 */
modifAlbum.onclick = function(){
  var albumID = document.getElementById("ca_album").value;
  var albumNa = document.getElementById("ca_albumna").value;
  var idSong = document.getElementById("ca_Idsong").value;

  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
  xmlhttp.open("GET", "http://localhost:8080/api/songs/"+idSong, false);
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
    xmlhttp.open("PUT", "http://localhost:8080/api/songs/"+idSong, false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({"albumID":albumID.toString(),"albumName":albumNa,"authorID":cancion.authorID.toString(),
                                 "authorName":cancion.authorName,"genre":[cancion.genre],"id": idSong.toString(),"lenght":min+":"+sec(),
                                 "name":cancion.name}));

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
  xmlhttp.open("GET", "http://localhost:8080/api/songs/"+idSong, false);
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
    xmlhttp.open("PUT", "http://localhost:8080/api/songs/"+idSong, false);
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
   var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
   xmlhttp.open("DELETE", "http://localhost:8080/api/songs/"+idSong, false);
   xmlhttp.send();
   if(xmlhttp.status < 400){ //Respuesta valida, ha ido todo bien
     xmlhttp.open("DELETE", "http://localhost:8080/api/songs/"+idSong+"file", false);
     xmlhttp.send();

     alert('Cancion eliminada!');
     //Limpio los campos
     document.getElementById("el_Idsong").value = "";

   }else{
     alert('No he podido: ' + xmlhttp.statusText);
     console.log("Problemas...");
     console.log(xmlhttp.statusText);
   }
}

 /**
  * Cuando el boton eliminarAlbum es pulsado
  */
  eliminarAlbum.onclick = function () {
    var idAlbum = document.getElementById("el_Idalbum").value;
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("DELETE", "http://localhost:8080/api/albums/"+idAlbum, false);
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
