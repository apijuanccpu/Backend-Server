var express = require('express');
// var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Anotacio = require('../models/anotacio');
var form_busquedas = require('./busqueda');

//Rutas

// ===================
//Obtener anotaciones por persona
// =========================

app.get('/', (req, res, next) => {

    id_persona = req.params.idpersona;

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Anotacio.find({

    })

    .exec(

        (err, anotacions) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando anotacio',
                    errors: err
                });
            }

            Anotacio.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    anotacions: anotacions,
                    total: conteo
                });
            });


        });
});

// ===================
//Obtener anotaciones por persona
// =========================

app.get('/porpersona/:idpersona', (req, res, next) => {

    id_persona = req.params.idpersona;

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Anotacio.find({
        persona: id_persona
    })

    .exec(

        (err, anotacions) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando anotacio',
                    errors: err
                });
            }

            Anotacio.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    anotacions: anotacions,
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

    var anotacio = new Anotacio({
        data: body.data,
        usuario: body.usuario,
        persona: body.persona,
        text: body.text

    });

    anotacio.save((err, anotacioGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear anotacio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            peticio: anotacioGuardada
        });

    });
});

// ===================
// Obtener anotacio porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findById(id)
        .exec((err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe',
                    errors: { message: 'No existe un usuario con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuario
            });
        });
});

// ===================
// Borrar anotacio porid
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Anotacio.findByIdAndRemove(id, (err, anotacioEsborrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar anotacio',
                errors: err
            });
        }
        if (!anotacioEsborrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe anotacio con ese id',
                errors: { message: 'No existe anotacio con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            anotacio: anotacioEsborrada
        });

    });

});

// ===================
// Borrar anotacio per persona
// =========================
app.delete('/perPersona/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Anotacio.remove({ 'persona': id }, (err, anotacioEsborrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar anotacio',
                errors: err
            });
        }
        if (!anotacioEsborrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe anotacio con ese id',
                errors: { message: 'No existe anotacio con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            anotacio: anotacioEsborrada
        });

    });

});

module.exports = app;