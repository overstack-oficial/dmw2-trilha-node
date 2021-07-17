const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pedido = require('./Pedido');
const Produto = require('./Produto');

const PedidoProduto = new Schema({
  pedidoId: {
    type: mongoose.Types.ObjectId,
    ref: 'Pedido',
    required: true,
  },
  produtoId: {
    type: mongoose.Types.ObjectId,
    ref: 'Produto',
    required: true,
  },
  valorUnitario: {
    type: Number,
    required: true,
  },
  quantidade: {
    type: Number,
    default: 1,
  },
  observacao: String,
});

PedidoProduto.post('validate', async (doc, next) => {
  const pedido = await Pedido.findById(doc.pedidoId);
  const produto = await Produto.findById(doc.produtoId);

  if (pedido && produto && pedido.restauranteId.toString() == produto.restauranteId.toString()) {
    next();
  } else {
    next(new Error('Produto ou Pedido não encontrado!'));
  }
});

module.exports = mongoose.model('PedidoProduto', PedidoProduto);
