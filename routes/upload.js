var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

//default options
app.use(fileUpload());


var Usuario = require('../models/usuario');
var Informe = require('../models/informe');



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['usuarios', 'informes'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            mensaje: 'La colecció no es valida',
            errors: { message: 'Heu de seleccionar una colecció valida' }
        });

    }

    if (!req.files) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No archivos seleccionados',
            errors: { message: 'Debe seleccionar un archivo' }
        });

    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensions que acceptem
    var extensionesValidas = ['pdf', 'jpg', 'png'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: ' Les extensions valides son:' + extensionesValidas }
        });
    }

    // Nom de l'arxiu
    // var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    var nombreArchivo = `${ id }.${ extensionArchivo }`;
    // Mover el archivo del temporal al path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al moure el fitxer',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);

    });


});


function subirPorTipo(tipo, id, nombre_archivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);
            }
            usuario.img = nombre_archivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    console.log(err);
                    return;
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imatge de usuari actualitzada',
                    usuario: usuarioActualizado
                });
            });



        });
        return;
    }
    if (tipo === 'informes') {
        Informe.findById(id, (err, informe) => {
            var pathViejo = './uploads/informes/' + informe.doc_informe;
            if (fs.existsSync(pathViejo)) {
                console.log('consulta el path');
                fs.unlink(pathViejo);
            }
            informe.doc_informe = nombre_archivo;

            informe.save((err, informeActualitzat) => {
                if (err) {
                    console.log(err);
                    return;
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Document dinforme actualitzat',
                    informe: informeActualitzat
                });
            });



        });
        return;
    }
}

module.exports = app;