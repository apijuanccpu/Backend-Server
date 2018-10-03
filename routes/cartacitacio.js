var express = require('express');
// var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');



var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();


var CartaCitacio = require('../models/cartacitacio');
// var form_busquedas = require('./busqueda');

//Rutas

// ===================
//Obtener todos los Informes
// =========================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    CartaCitacio.find({})

    //.populate('informe', 'nombre data vigencia usuario persona')
    .populate('usuari')
        .populate('professional')
        .populate('empresasubministradora')
        .exec(

            (err, cartes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'ERror cargando cartes',
                        errors: err
                    });
                }

                CartaCitacio.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        cartes: cartes,
                        total: conteo
                    });
                });


            });
});

// app.get('/cartaperpersona/:idpersona', (req, res, next) => {

//     var idpersona = req.params.idpersona;
//     var desde = req.query.desde || 0;
//     desde = Number(desde);

//     CartaCitacio.find({
//         usuari: idpersona
//     })

//         .populate('usuario')
//         .populate('persona')
//         .exec(

//             (err, cartes) => {
//                 if (err) {
//                     res.status(500).json({
//                         ok: false,
//                         mensaje: 'ERror cargando carta',
//                         errors: err
//                     });
//                 }

//                 CartaCitacio.count({}, (err, conteo) => {

//                     res.status(200).json({
//                         ok: true,
//                         cartes: cartes,
//                         total: conteo
//                     });
//                 });


//             });
// });

// ===================
// Actualizar
// =========================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    CartaCitacio.findById(id, (err, carta) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El carta no existe',
                errors: err
            });
        }
        if (!carta) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El carta con el _id' + id + ' no existe',
                errors: { message: 'No existe carta con ese id' }
            });
        }

        carta.numero = body.numero;
        carta.data_creacio = body.data_creacio;
        carta.data_enviament = body.data_enviament;
        carta.data_recepcio = body.data_recepcio;
        carta.empresasubministradora = body.empresasubministradora;
        carta.professional = body.professional;
        carta.usuari = body.usuari;
        carta.observacions = body.observacions;


        carta.save((err, cartaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'ERror al actualizar carta',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                carta: cartaGuardada
            });
        });


    });



});



// ===================
//Crear nuevo carta
// =========================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var carta = new CartaCitacio({
        numero: body.numero,
        data_creacio: body.data_creacio,
        data_enviament: body.data_enviament,
        data_recepcio: body.data_recepcio,
        professional: body.professional,
        empresasubministradora: body.empresasubministradora,
        usuari: body.usuari,
        observacions: body.observacions

    });

    carta.save((err, cartaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'ERror al crear carta',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            carta: cartaGuardada
        });

    });
});

// ===================
// Borrar carta
// =========================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    CartaCitacio.findByIdAndRemove(id, (err, cartaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el informe',
                errors: err
            });
        }
        if (!cartaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe carta con ese id',
                errors: { message: 'No existe carta con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            carta: cartaBorrada
        });

    });

});

// ===================
// Obtener informe porid
// =========================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    CartaCitacio.findById(id)
    .populate('usuari')
    .populate('professional')
    .populate('empresasubministradora')
        .exec((err, carta) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar carta',
                    errors: err
                });
            }
            if (!carta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El carta con el id ' + id + ' no existe',
                    errors: { message: 'No existe un informe con ese id' }
                });
            }
            res.status(200).json({
                ok: true,
                carta: carta
            });
        });
});

// ===================
// Obtener carta por Usuario
// =========================
app.get('/perpersona/:idpersona', (req, res) => {

    var personaid = req.params.idpersona;

    CartaCitacio.find({
        'usuario': personaid
    })

    .populate('usuari')
    .populate('professional')
    .populate('empresasubministradora')
    .exec((err, carta) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }
            if (!carta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El carta con la usuario ' + personaid + ' no existe',
                    errors: { message: 'No existe un carta con ese persona' }
                });
            }
            res.status(200).json({
                ok: true,
                carta: carta
            });
        });
});

// ===================
// Obtener informe por fecha
// =========================
// ===================
// Busqueda per filtre
// =========================
// app.get('/datainf/:quinadata/:data', (req, res) => {

//     var busqueda = req.params.data;
//     var tabla = req.params.quinadata;
//     //var regex = new RegExp(busqueda, 'i');

//     Informe.find({

//         })
//         .where('vigencia').lt(busqueda)

//     .exec((err, informes) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar informes',
//                 errors: err
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             informes: informes,
//             total: informes.length
//         });
//     });


// });

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
// app.get('/informevigentafalse/:idpersona', mdAutenticacion.verificaToken, (req, res) => {

//     var idpersona = req.params.idpersona;
//     var body = req.body;



//     Informe.find({
//         persona: idpersona,
//         vigent: true
//     })

//     .exec(
//         (err, informeDB) => {


//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: 'El informe no existe',
//                     errors: err
//                 });
//             }
//             if (!informeDB) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'El informe con la persona ' + idpersona + ' no existe',
//                     errors: { message: 'No existe un informe con ese persona' }
//                 });
//             }

//             res.status(200).json({
//                 ok: true,
//                 informe: informeDB
//             });
//         });
// });
// ===================
// Actualizar vigent
// =========================
// app.put('/informevigentafalse/:idinforme', mdAutenticacion.verificaToken, (req, res) => {

//     var id = req.params.idinforme;
//     // var body = req.body;



//     Informe.findById(id, (err, informeDB) => {


//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'El informe no existe',
//                 errors: err
//             });
//         }
//         if (!informeDB) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'El informe con el ' + id + ' no existe',
//                 errors: { message: 'No existe un informe con ese persona' }
//             });
//         } else {
//             informeDB.vigent = false;
//         }




//         informeDB.save((err, informeGuardat) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'ERror al actualizar informe',
//                     errors: err
//                 });
//             }

//             res.status(200).json({
//                 ok: true,
//                 informe: informeGuardat
//             });
//         });


//     });



// });



module.exports = app;