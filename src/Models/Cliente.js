const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Restaurante = require('./Restaurante');

const Cliente = new Schema({
  nome: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
    validate: [/^[0-9]{10,11}$/, 'Formato inválido! Formato: 9999999999 ou 99999999999'],
  },
  endereco: {
    coordinates: [], // Latitude, Longitude
    numero: String,
    observacao: String,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
  restauranteId: {
    type: mongoose.Types.ObjectId,
    ref: 'Restaurante',
    required: true,
  },
});

// Validation para restaurante
Cliente.post('validate', (doc, next) => {
  Restaurante.findById(doc.restauranteId, (err, restaurante) => {
    if (!err && restaurante) {
      next();
    } else {
      next(new Error('Restaurante não existe'));
    }
  });
});

module.exports = mongoose.model('Cliente', Cliente);
