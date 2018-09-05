var express = require('express');
// var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Peticio = require('../models/peticio');
var form_busquedas = require('./busqueda');

//Rutas

// ===================
//Obtener todos los Peticions
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Peticio.find({})

    .exec(

        (err, peticions) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando peticio',
                    errors: err
                });
            }

            Peticio.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    peticions: peticions,
                    total: conteo
                });
            });


        });
});

// ===================
//PEticiones por estado
// =========================

app.get('/porEstado/:estado', (req, res, next) => {

    var estado = req.params.estado;

    Peticio.find({
        finalitzada: estado
    })

    .exec(

        (err, peticions) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando peticio',
                    errors: err
                });
            }

            Peticio.count({
                finalitzada: estado
            }, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    peticions: peticions,
                    total: conteo
                });
            });


        });
});

// ===================
//Crear nuevo informe
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var peticio = new Peticio({
        data: body.data,
        dataincorporacio: body.dataincorporacio,
        num_registre: body.num_registre,
        empresa_energetica: body.empresa_energetica,
        finalitzada: false

    });

    peticio.save((err, peticioGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear petcicio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            peticio: peticioGuardada
        });

    });
});

// ===================
// Borrar peticio dni
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Peticio.findByIdAndRemove(id, (err, peticioBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el peticio',
                errors: err
            });
        }
        if (!peticioBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe peticio con ese id',
                errors: { message: 'No existe peticio con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            peticio: peticioBorrada
        });

    });
});
// ===================
// Obtener peticio porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Peticio.findById(id)
        .exec((err, peticio) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar peticio',
                    errors: err
                });
            }
            if (!peticio) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El peticio con el id ' + id + ' no existe',
                    errors: { message: 'No existe un peticio con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                peticio: peticio
            });
        });
});

// ===================
// Actualizar
// =========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Peticio.findById(id, (err, peticio) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El peticio no existe',
                errors: err
            });
        }
        if (!peticio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El peticio con el _id' + id + ' no existe',
                errors: { message: 'No existe peticio con ese id' }
            });
        }

        peticio.data = body.data;
        peticio.dataincorporacio = body.dataincorporacio;
        peticio.num_registre = body.num_registre;
        peticio.empresa_energetica = body.empresa_energetica;
        peticio.finalitzada = body.finalitzada;

        peticio.save((err, peticioGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar peticio',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                peticio: peticioGuardada
            });
        });


    });



});


module.exports = app;