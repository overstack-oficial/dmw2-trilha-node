require('dotenv').config();
const jwt = require('jsonwebtoken');
const Restaurante = require('../models/Restaurante');
const passwordHash = require('password-hash');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  await Restaurante.findOne({ email }, (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message
      });
    }

    if (doc) {
      if (passwordHash.verify(senha, doc.senha)) {
        const token = jwt.sign({ restaurant_id: doc._id }, process.env.SECRET);
        return res.json({
          error: false,
          message: 'Login realizado com sucesso',
          token
        });
      }

      return res.status(400).json({
        error: true,
        message: 'Senha não confere!'
      });
    }

    return res.status(400).json({
      error: true,
      message: 'Email não cadastrado!'
    });
  });
}

exports.signup = async (req, res) => {
  const { senha } = req.body;
  const hashedPassword = passwordHash.generate(senha);

  req.body.senha = hashedPassword;
  await Restaurante.create({ ...req.body }, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message
      });
    }

    return res.status(201).json({
      error: false,
      message: 'Restaurante cadastrado com sucesso!'
    });
  });
}

exports.index = async (req, res) => {
  await Restaurante.find({}, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message
      });
    }

    return res.status(200).json({
      error: false,
      restaurantes: docs,
    });
  });
}