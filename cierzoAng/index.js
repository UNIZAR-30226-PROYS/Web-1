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


app.get('/albums', function (req, res) {
    res.json([{
        img: 'https://st-listas.20minutos.es/images/2008-04/13429/182301_640px.jpg?1223584667',
        autor: 'Extremoduro',
        titulo: 'Agila'
    },
        
    {
        img: 'https://i.pinimg.com/originals/c0/bd/df/c0bddf69fc8fa8cc2bdbe8283aa6615e.jpg',
        autor: 'Extremoduro',
        titulo: 'Deltoya'
    },
    
    {
        img: 'https://www.elquintobeatle.com/wp-content/uploads/2015/02/extremoduro-la-ley-innata-1.jpg',
        autor: 'Extremoduro',
        titulo: 'La ley innata'
    },
        
    {
        img: 'https://img.discogs.com/dfvL1Qt5Ed9wuaqXAwX55bI4oAQ=/fit-in/600x587/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1412225-1513096916-6051.jpeg.jpg',
        autor: 'Extremoduro',
        titulo: 'Yo, minoría absoluta'
    }
    
    ]); 
    
});



app.get('/artists', function (req, res) {
    res.json([{
        img: 'https://i0.wp.com/www.informavalencia.com/wp-content/uploads/2017/08/extremoduro2.jpg?fit=915%2C585&ssl=1',
        name: 'Extremoduro'
    },
        
    {
        img: 'http://www.artistasyorquestas.com/fotografiasservicios/fito_y_fitipaldis.jpg',
        name: 'Fito y los fitipaldis'
    },
    
    {
        img: 'https://todoindie.com/wp-content/uploads/2018/01/la-raiz-copia.jpg',
        name: 'La raíz'
    },
        
    {
        img: 'https://ep01.epimg.net/elpais/imagenes/2017/09/19/icon/1505810414_437848_1505820319_noticia_normal.jpg',
        name: 'Maluma'
    }
    
    ]); 
    
});
 
app.listen(port);
console.log('Express server running at http://localhost:' + port);