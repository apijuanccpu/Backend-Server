var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var express = require('express');

var app = express();

var fs = require('fs');
var path = require('path');

app.get('/:codi_carta', (req, res, next) => {

    var codicarta = req.params.codi_carta;
    //Load the docx file as a binary
    var content = fs
        .readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    var zip = new JSZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);

    //set the templateVariables
    doc.setData({
        first_name: 'John',
        last_name: 'Doe',
        phone: '0652455478',
        description: 'New Website'
    });

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({error: e}));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }

    var buf = doc.getZip()
                .generate({type: 'nodebuffer'});

    var pathDocument = path.resolve(__dirname, `../uploads/cartes/${codicarta}.docx`);

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(pathDocument, buf);
    // //res.sendFile(path.resolve(__dirname, `../uploads/cartes/${codicarta}.docx`));    
    // var pathDocument = path.resolve(__dirname, `../uploads/cartes/${codicarta}.docx`);
    // res.download(pathDocument,'documentttt.pdf', function(err){
    //     if (err) {
    //         throw err;
    //     }
    // });

});

app.get('/getCarta/:codi_carta', (req, res, next) => {

    var codicarta = req.params.codi_carta;
    

    var pathcarta = path.resolve(__dirname, `../uploads/cartes/${codicarta}.docx`);

    if (fs.existsSync(pathcarta)) {
        res.download(pathcarta);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;

