var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var peticioSchema = new Schema({
    data: { type: String, required: [true, 'La data de linforme es necessaria'] },
    dataincorporacio: { type: String, required: [true, 'La data de linforme es necessaria'] },
    num_registre: { type: String, required: false },
    empresa_energetica: { type: String, required: false },
    finalitzada: { type: Boolean, required: false }
});

module.exports = mongoose.model('Peticio', peticioSchema);