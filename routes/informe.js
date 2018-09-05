var express = require('express');
// var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var Informe = require('../models/informe');
var form_busquedas = require('./busqueda');

//Rutas

// ===================
//Obtener todos los Informes
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Informe.find({})

    //.populate('informe', 'nombre data vigencia usuario persona')
    .populate('usuario')
        .populate('persona')
        .exec(

            (err, informes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando informe',
                        errors: err
                    });
                }

                Informe.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        informes: informes,
                        total: conteo
                    });
                });


            });
});

app.get('/infperpersona/:idpersona', (req, res, next) => {

    var idpersona = req.params.idpersona;
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Informe.find({
        persona: idpersona
    })

    .populate('informe', 'nombre data vigencia usuario persona')
        .populate('usuario')
        .populate('persona')
        .exec(

            (err, informes) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando informe',
                        errors: err
                    });
                }

                Informe.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        informes: informes,
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

    Informe.findById(id, (err, informe) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El informe no existe',
                errors: err
            });
        }
        if (!informe) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El informe con el _id' + id + ' no existe',
                errors: { message: 'No existe informe con ese id' }
            });
        }

        informe.nombre = body.nombre;
        informe.data = body.data;
        informe.vigencia = body.vigencia;
        informe.vigent = body.vigent;
        informe.doc_informe = body.doc_informe;
        informe.persona = body.persona;
        informe.usuario = body.usuario;


        informe.save((err, informeGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar informe',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                informe: informeGuardat
            });
        });


    });



});



// ===================
//Crear nuevo informe
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var informe = new Informe({
        nombre: body.nombre,
        data: body.data,
        vigencia: body.vigencia,
        vigent: true,
        usuario: body.usuario,
        persona: body.persona

    });

    informe.save((err, informeGuardat) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear informe',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            informe: informeGuardat
        });

    });
});

// ===================
// Borrar usuario dni
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Informe.findByIdAndRemove(id, (err, informeBorrat) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el informe',
                errors: err
            });
        }
        if (!informeBorrat) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe informe con ese id',
                errors: { message: 'No existe informe con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            informe: informeBorrat
        });

    });

});

// ===================
// Obtener informe porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Informe.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('persona')
        .exec((err, informe) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!informe) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El informe con el id ' + id + ' no existe',
                    errors: { message: 'No existe un informe con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                informe: informe
            });
        });
});

// ===================
// Obtener informe por persona
// =========================
app.get('/porpersona/:idpersona', (req, res) => {

    var personaid = req.params.idpersona;

    Informe.find({
        'persona': personaid
    })

    .populate('persona')
        .exec((err, informe) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!informe) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El informe con la persona ' + personaid + ' no existe',
                    errors: { message: 'No existe un informe con ese persona' }
                });
            }
            res.status(200).json({
                ok: true,
                informe: informe
            });
        });
});

// ===================
// Obtener informe por fecha
// =========================
// ===================
// Busqueda per filtre
// =========================
app.get('/datainf/:quinadata/:data', (req, res) => {

    var busqueda = req.params.data;
    var tabla = req.params.quinadata;
    //var regex = new RegExp(busqueda, 'i');

    Informe.find({

        })
        .where('vigencia').lt(busqueda)

    .exec((err, informes) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar informes',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            informes: informes,
            total: informes.length
        });
    });


});

// app.get('/datainf/:quinadata/:data', (req, res) => {

//     var busqueda = req.params.data;
//     var tabla = req.params.quinadata;
//     var regex = new RegExp(busqueda, 'i');

//     var promesa;

//     promesa = buscarperVigencia(busqueda);
//     promesa.then(data => {

//         res.status(200).json({
//             ok: true,
//             informes: data
//         });
//     });

// });

// function buscarperVigencia(regex) {

//     console.log(regex);

//     console.log(new Date(regex));



//     return new Promise((resolve, reject) => {




//         Informe.find({

//             })
//             .where('vigencia').lt(regex)

//         .exec((err, informes) => {

//             if (err) {
//                 reject('Error al cargar los informes', err);
//             } else {
//                 resolve(informes);
//             }
//         });
//     });
// }

// ===================
// Comprovar si vigent
// =========================
app.get('/informevigentafalse/:idpersona', mdAutenticacion.verificaToken, (req, res) => {

    var idpersona = req.params.idpersona;
    var body = req.body;



    Informe.find({
        persona: idpersona,
        vigent: true
    })

    .exec(
        (err, informeDB) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'El informe no existe',
                    errors: err
                });
            }
            if (!informeDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El informe con la persona ' + idpersona + ' no existe',
                    errors: { message: 'No existe un informe con ese persona' }
                });
            }

            res.status(200).json({
                ok: true,
                informe: informeDB
            });
        });
});
// ===================
// Actualizar vigent
// =========================
app.put('/informevigentafalse/:idinforme', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.idinforme;
    // var body = req.body;



    Informe.findById(id, (err, informeDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El informe no existe',
                errors: err
            });
        }
        if (!informeDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El informe con el ' + id + ' no existe',
                errors: { message: 'No existe un informe con ese persona' }
            });
        } else {
            informeDB.vigent = false;
        }




        informeDB.save((err, informeGuardat) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar informe',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                informe: informeGuardat
            });
        });


    });



});



module.exports = app;