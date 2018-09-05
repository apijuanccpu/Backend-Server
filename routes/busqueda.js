var express = require('express');

var app = express();

var Persona = require('../models/persona');
var Informe = require('../models/informe');
var Usuario = require('../models/usuario');
var Peticio = require('../models/peticio');


// ===================
// Busqueda per filtre
// =========================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'persones':
            promesa = buscarPersones(busqueda, regex);
            break;
        case 'informes':
            promesa = buscarInformes(busqueda, regex);
            break;
        case 'peticions':
            promesa = buscarPeticions(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son, usuarios, informes y personas y peticions',
                error: { message: 'Tipo de tabla coleccion no valido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

app.get('/todo/:busqueda', (req, res, next) => {


    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([

            buscarPersones(busqueda, regex),
            buscarInformes(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                persones: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });

});

function buscarPersones(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Persona.find({}, 'nombre actiu comunitat dni data_ultim_informe ')
            // .populate('persona', 'nombre actiu comunitat dni data_ultim_informe ')
            .or([
                { 'nombre': regex },
                { 'dni': regex }
            ])
            .exec((err, persones) => {

                if (err) {
                    reject('Error al carregar persones', err);
                } else {
                    resolve(persones);
                }

            });
    });



}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([
                { 'nombre': regex },
                { 'email': regex }
            ])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar los usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

function buscarInformes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Informe.find({})
            .or([
                { 'nombre': regex },
                { 'data': regex }
            ])
            .populate('informe', 'nombre, data, vigencia, usuario, persona')
            .populate('usuario')
            .populate('persona')
            .exec((err, informes) => {

                if (err) {
                    reject('Error al cargar los informes', err);
                } else {

                    resolve(informes);
                }
            });



    });
}

function buscarPeticions(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Peticio.find({})
            .or([
                { 'num_registre': regex },
                { 'empresa_energetica': regex },
                { 'data': regex }
            ])
            // .populate('informe', 'nombre, data, vigencia, usuario, persona')

        .exec((err, peticions) => {

            if (err) {
                reject('Error al cargar los informes', err);
            } else {

                resolve(peticions);
            }
        });



    });
}

module.exports = app;