var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var dnipeticioSchema = new Schema({
    dni: { type: String, required: [true, 'el dni es obligatori'] },
    peticio: { type: String, required: [true, 'La peticio es obligatoria'] },
    acabat: { type: Boolean, required: [false, 'La data es obligatoria'] }
    // peticio: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Peticio',
    //     required: [true, 'El id peticio esun campo obligatorio ']
    // }

});


module.exports = mongoose.model('DniPeticio', dnipeticioSchema);