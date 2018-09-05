var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var informeSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    data: { type: String, required: [true, 'La data de linforme es necessaria'] },
    vigencia: { type: String, required: false },
    vigent: { type: Boolean, required: false },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id usuario esun campo obligatorio ']
    },
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: [true, 'El id persona esun campo obligatorio ']
    },
    doc_informe: { type: String, required: false }

}, { collection: 'informes' });


module.exports = mongoose.model('Informe', informeSchema);