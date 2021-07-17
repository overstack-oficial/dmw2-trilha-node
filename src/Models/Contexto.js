const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cliente = require('./Cliente');

const Contexto = new Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['welcome', 'initial', 'finish', 'address', 'cancel']
  },
  clienteId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Cliente',
  }
});

// Validation para cliente
Contexto.post('validate', (doc, next) => {
  Cliente.findById(doc.clienteId, (err, cliente) => {
    if (!err && cliente) {
      next();
    } else {
      next(new Error('Cliente não existe!'));
    }
  });
});

module.exports = mongoose.model('Contexto', Contexto);
