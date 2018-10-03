var express = require('express');
// var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Empresa = require('../models/empresa');
var form_busquedas = require('./busqueda');

//Rutas

// ===================
//Obtener todos los empreses
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Empresa.find({})

    //.populate('informe', 'nombre data vigencia usuario persona')
     .exec(
        (err, empreses) => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     mensaje: 'ERror cargando empreses',
                     errors: err
                 });
             }

                Empresa.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        empreses: empreses,
                        total: conteo
                    });
                });


            });
});

// ===================
// Actualizar
// =========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Empresa.findById(id, (err, empresa) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El informe no existe',
                errors: err
            });
        }
        if (!empresa) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El empresa con el _id' + id + ' no existe',
                errors: { message: 'No existe empresa con ese id' }
            });
        }

        empresa.nombre = body.nom;
        empresa.direccio = body.direccio;
        empresa.poblacio = body.poblacio;
        empresa.codipostal = body.codipostal;
        empresa.observacions = body.observacions;
        
        
        empresa.save((err, empresaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar informe',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                empresa: empresaGuardada
            });
        });


    });



});



// ===================
//Crear nuevo informe
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var empresa = new Empresa({
        nom: body.nom,
        direccio: body.direccio,
        poblacio: body.poblacio,
        codipostal: body.codipostal,
        observacions: body.observacions
    });

    empresa.save((err, empresaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear empresa',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            empresa: empresaGuardada
        });

    });
});

// ===================
// Borrar usuario dni
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Empresa.findByIdAndRemove(id, (err, empresaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el empresa',
                errors: err
            });
        }
        if (!empresaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe empresa con ese id',
                errors: { message: 'No existe empresa con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            empresa: empresaBorrada
        });

    });

});

// ===================
// Obtener informe porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Empresa.findById(id)
       
        .exec((err, empresa) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!empresa) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El empresa con el id ' + id + ' no existe',
                    errors: { message: 'No existe un informe con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                empresa: empresa
            });
        });
});

module.exports = app;