var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:doc', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.doc;

    var pathDocument = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathDocument)) {
        res.sendFile(pathDocument);
    } else {
        var pathNoDocument = path.resolve(__dirname, '../assets/no-doc.pdf');
        res.sendFile(pathNoDocument);
    }

});

module.exports = app;