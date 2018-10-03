var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var empresaSchema = new Schema({
    
    nom: { type: String, required: [true, 'El nom de linforme es necessaria'] },
    direccio: { type: String, required: [true, 'La direcció es necessaria'] },
    poblacio: { type: String, required: false },
    codipostal: { type: Number, required: false },
    observacions: { type: String, required: false },
   
});

module.exports = mongoose.model('Empresa', empresaSchema);