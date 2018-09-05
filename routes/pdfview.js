var express = require('express'),
    app = express(),
    pdf = require('express-pdf');


// res.pdfFromHTML({
//     filename: 'generated.pdf',
//     html: path.resolve(__dirname, './template.html'),
//     //options: {...}
// });

app.use('/pdf', function(req, res) {
    res.pdf(path.resolve(__dirname, './original.pdf'));

});


module.exports = app;