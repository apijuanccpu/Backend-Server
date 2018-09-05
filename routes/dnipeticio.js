var express = require('express');
// var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var DniPeticio = require('../models/dnipeticio');
var form_busquedas = require('./busqueda');

//Rutas

// ===================
//Obtener todos los dnis
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    DniPeticio.find({})


    .exec(

        (err, dnis) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando dnis',
                    errors: err
                });
            }

            DniPeticio.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    dnis: dnis,
                    total: conteo
                });
            });


        });
});

// ===================
//Obtener todos los dnis
// =========================

app.get('/comprobasidnisoberts/:idpeticio', (req, res, next) => {

    var idpeticion = req.params.idpeticio;

    DniPeticio.find({
        peticio: idpeticion,
        acabat: false
    })


    .exec(

        (err, dnis) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando dnis',
                    errors: err
                });
            }

            DniPeticio.count({
                peticio: idpeticion,
                acabat: false
            }, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    dnis: dnis,
                    total: conteo
                });
            });


        });
});


// ===================
//Obtener dnis por peticion
// =========================

app.get('/porpeticion/:idpeticion', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    var idpeticion = req.params.idpeticion;

    DniPeticio.find({
        peticio: idpeticion
    })


    .exec(

        (err, dnis) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'ERror cargando dnis',
                    errors: err
                });
            }

            DniPeticio.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    dnis: dnis,
                    total: conteo
                });
            });


        });
});

// =========================
// Insertar DNI
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var dnipeticio = new DniPeticio({
        dni: body.dni,
        peticio: body.peticio,
        acabat: body.acabat
    });

    dnipeticio.save((err, dniguardat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear dni',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            dni: dniguardat
        });

    });
});

app.put('/finalitzardnipeticio/:iddnipeticio', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.iddnipeticio;
    // var body = req.body;



    DniPeticio.findById(id, (err, dnipeticioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El informe no existe',
                errors: err
            });
        }
        if (!dnipeticioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El informe con el ' + id + ' no existe',
                errors: { message: 'No existe un informe con ese persona' }
            });
        } else {
            dnipeticioDB.acabat = true;
        }




        dnipeticioDB.save((err, dnipeticioguardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar informe',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                dni: dnipeticioDB
            });
        });


    });



});



// ===================
// Esborrar dnis petició
// =========================
app.delete('/esborradnispeticio/:idpeticio', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.idpeticio;

    DniPeticio.remove({ 'peticio': id }, (err, dnipeticioEsborrat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar anotacio',
                errors: err
            });
        }
        if (!dnipeticioEsborrat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe anotacio con ese id',
                errors: { message: 'No existe anotacio con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            dnis: dnipeticioEsborrat
        });

    });

});



module.exports = app;