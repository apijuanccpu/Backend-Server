var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var cartacitacioSchema = new Schema({
    numero: { type: Number, required: [true, 'El	nombre	es	necesario'] },
    data_creacio: { type: String, required: [true, 'La data de linforme es necessaria'] },
    data_enviament: { type: String, required: false },
    data_recepcio: { type: String, required: false },
    empresasubministradora: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'El id empresa esun campo obligatorio ']
    },
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id usuario esun campo obligatorio ']
    },
    usuari: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: [true, 'El id persona esun campo obligatorio ']
    },
    doc_informe: { type: String, required: false }

});


module.exports = mongoose.model('CartaCitacio', cartacitacioSchema);