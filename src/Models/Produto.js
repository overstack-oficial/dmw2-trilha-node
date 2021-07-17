const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categoria = require('./Categoria');
const Restaurante = require('./Restaurante');

const Produto = new Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: String,
  categoriaId: {
    type: mongoose.Types.ObjectId,
    ref: 'Categoria',
  },
  valor: {
    type: Number,
    required: true,
  },
  situacao: {
    type: String,
    enum: ['A', 'I', 'E'], // Ativo, Inativo e Excluído
    default: 'A',
  },
  restauranteId: {
    type: mongoose.Types.ObjectId,
    ref: 'Restaurante',
    required: true,
  },
});

// Validation para restaurante
Produto.post('validate', (doc, next) => {
  Restaurante.findById(doc.restauranteId, (err, restaurante) => {
    if (!err && restaurante) {
      next();
    } else {
      next(new Error('Restaurante não existe'));
    }
  });
});

// Validation para categoria
Produto.post('validate', (doc, next) => {
  if (doc.categoriaId) {
    Categoria.findById(doc.categoriaId, (err, categoria) => {
      if (!err && categoria) {
        if (doc.restauranteId.toString() === categoria.restauranteId.toString()) {
          next();
        } else {
          next(new Error('Categoria não existe'));
        }
      } else {
        next(new Error('Categoria não existe'));
      }
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('Produto', Produto);
