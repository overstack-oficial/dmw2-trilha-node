const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Restaurante = require('./Restaurante');

const Categoria = new Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
  },
  descricao: String,
  restauranteId: {
    type: mongoose.Types.ObjectId,
    ref: 'Restaurante',
    required: true,
  },
});

// Validation para restaurante
Categoria.post('validate', (doc, next) => {
  Restaurante.findById(doc.restauranteId, (err, restaurante) => {
    if (!err && restaurante) {
      next();
    } else {
      next(new Error('Restaurante não existe'));
    }
  });
});

module.exports = mongoose.model('Categoria', Categoria);
