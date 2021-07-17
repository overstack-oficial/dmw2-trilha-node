const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Restaurante = require('./Restaurante');
const Cliente = require('./Cliente');

const Pedido = new Schema({
  restauranteId: {
    type: mongoose.Types.ObjectId,
    ref: 'Restaurante',
    required: true,
  },
  clienteId: {
    type: mongoose.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  situacao: {
    type: String,
    enum: ['A', 'F', 'P', 'S', 'E', 'C'], // Aberto, Fila, Preparando, Saída, Entregue e Cancelado
    default: 'A',
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

// Validation para restaurante
Pedido.post('validate', (doc, next) => {
  Restaurante.findById(doc.restauranteId, (err, restaurante) => {
    if (!err && restaurante) {
      next();
    } else {
      next(new Error('Restaurante não existe'));
    }
  });
});

// Validation para cliente
Pedido.post('validate', (doc, next) => {
  Cliente.findById(doc.clienteId, (err, cliente) => {
    if (!err && cliente) {
      if (doc.restauranteId.toString() == cliente.restauranteId.toString()) {
        next();
      } else {
        next(new Error('Cliente não existe'));
      }
    } else {
      next(new Error('Cliente não existe'));
    }
  });
});

module.exports = mongoose.model('Pedido', Pedido);
