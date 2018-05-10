var express = require("express"),
    fs = require('fs'),
    port = process.env.PORT || 2595;
 
var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.set("view options", {
    layout: false
});
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
    res.render('public/index.html');
});

app.get('/canciones', function (req, res) {
    res.json([{
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
    
    ]); 
});


app.get('/cancion', function (req, res) {
    res.json([{
        title: 'La llamada',
        artist: 'Leiva',
        url: 'songs/llamada.mp3',
        art: 'http://abarcarodriguez.com/365/files/offspring.jpg'
    }
    
    ]); 
});


app.get('/lista', function (req, res) {
    res.json([{
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeV-OSRu3Vju4JEA4kvp65HHaxQUal2SwxjsotxKQGYx1Kkkv5tQ',
        name: 'Favoritas',
        desc: 'Lista de reproducción de las canciones favoritas del gran Pepe Viyuela.',
        num: 20,
        link: 'http://localhost:2595/cancion'
    },
        
    {
        imagen: 'http://www.banderasysoportes.es/WebRoot/StoreES3/Shops/ec4701/5262/5CDE/B7B2/D66A/1C2A/AC10/1415/BD7F/Spain_m.png',
        name: 'Top España',
        desc: 'Lista de reproducción de las canciones favoritas de ESPAÑA.',
        num: 20,
        link: 'http://localhost:2595/cancion'
    },
    
    {
        imagen: 'https://image.freepik.com/foto-gratis/mundo-lengua-global-tierra-internacional-mundo_121-97864.jpg',
        name: 'Top Mundo',
        desc: 'Lista de reproducción de las canciones favoritas del MUNDO.',
        num: 20,
        link: 'http://localhost:2595/cancion'
    },
        
    {
        imagen: 'https://yt3.ggpht.com/a-/AJLlDp1-r-Co_BiFMOepqEa7RooEGiTo_RhzJkX4Sg=s900-mo-c-c0xffffffff-rj-k-no',
        name: 'Daily mix',
        desc: 'Lista de reproducción de las canciones perfectas para ti.',
        num: 20,
        link: 'http://localhost:2595/cancion'
    }
    
    ]); 
});
 
app.listen(port);
console.log('Express server running at http://localhost:' + port);