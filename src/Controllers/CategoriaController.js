const Categoria = require('../models/Categoria');

exports.index = async (req, res) => {
  const { restaurant_id: id } = req.headers;

  await Categoria.find({ restauranteId: id }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message
      });
    }

    return res.status(200).json({
      error: false,
      categorias: docs,
    });
  });
}

exports.store = async (req, res) => {
  const { restaurant_id: id } = req.headers;

  let doc = { ...req.body };
  doc.restauranteId = id;


  await Categoria.create(doc, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message
      });
    }

    return res.status(201).json({
      error: false,
      message: 'Categoria cadastrada com sucesso!'
    });
  });
}

exports.edit = async (req, res) => {
  const { restaurant_id: id } = req.headers;
  const { categoria_id } = req.params;

  await Categoria.findOneAndUpdate(
    { _id: categoria_id, restauranteId: id }, 
    { ...req.body }, { new: true, runValidators: true }, 
    (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message
      });
    }

    return res.status(201).json({
      error: false,
      message: 'Categoria editada com sucesso!',
      categoria: doc,
    });
  });
}

exports.delete = async (req, res) => {
  const { restaurant_id: id } = req.headers;
  const { categoria_id } = req.params;

  await Categoria.findOneAndDelete({ _id: categoria_id, restauranteId: id }, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Categoria deletada com sucesso!',
    });
  });
}

