//Requires 
var express = require('express');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');

// Inicializar variables

var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    // res.header("Acces-Control-Allow-Methods", "DELETE");
    next();
});
// body parser

app.use(bodyParser.urlencoded({ extended: false }));
//parse application /json
app.use(bodyParser.json());

//Importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var personaRoutes = require('./routes/persona');
var informeRoutes = require('./routes/informe');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var documentsRoutes = require('./routes/documents');
var imagenesRoutes = require('./routes/imagenes');
var pdfRoutes = require('./routes/pdfview');
var peticioRoutes = require('./routes/peticio');
var anotacioRoutes = require('./routes/anotacio');
var dnipeticioRoutes = require('./routes/dnipeticio');
var cartacitacioRoutes = require('./routes/cartacitacio');
var empresaRoutes = require('./routes/empresa');
var docTemplateRoutes = require('./routes/docTemplate');


//Base de dades
mongoose.connection.openUri('mongodb://192.168.1.193:27017/SerSocDB', (err, res) => {
//mongoose.connection.openUri('mongodb://localhost:27017/SerSocDB', (err, res) => {
    if (err) throw err;

    console.log('Conexion con la base de datos correcta: \x1b[32m%s\x1b[0m', 'online');

});

// server index config

// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(___dirname + '/uploads'));



//Rutas
// app.use('/medico', medicosRoutes);
app.use('/persona', personaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/informe', informeRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/doc', documentsRoutes);
app.use('/img', imagenesRoutes);
app.use('/pdfview', pdfRoutes);
app.use('/peticio', peticioRoutes);
app.use('/anotacio', anotacioRoutes);
app.use('/dnipeticio', dnipeticioRoutes);
app.use('/cartacitacio', cartacitacioRoutes);
app.use('/empresa', empresaRoutes);
app.use('/doctemplate', docTemplateRoutes);

app.use('/', appRoutes);




//Escuchar 

app.listen(3000, () => {
    console.log('Express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});