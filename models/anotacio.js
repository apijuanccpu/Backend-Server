var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var anotacioSchema = new Schema({
    data: { type: String, required: [true, 'La data de lanotacio es necessaria'] },
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
    text: { type: String, required: false },

});


module.exports = mongoose.model('Anotacio', anotacioSchema);