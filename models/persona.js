var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var personaSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    dni: { type: String, required: [true, 'El	dni	es	necesario'] },
    domicili: { type: String, required: [true, 'El	domicili	es	necesario'] },
    codipostal: { type: Number, required: [true, 'El codi postal es	necesario'] },
    poblacio: { type: String, required: false },
    actiu: { type: String, required: [true, 'El	actiu	es	necesario'] },
    comunitat: { type: String, required: [true, 'El	comunitat	es	necesario'] },
    data_ultim_informe: { type: String, required: false },
    professional: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    numexphestia: { type: Number, required: false }
}, { collection: 'persones' });





module.exports = mongoose.model('Persona', personaSchema);