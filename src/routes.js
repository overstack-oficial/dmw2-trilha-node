const routes = require('express').Router();

//rotas 
const LoginController = require('./Controllers/LoginController');
const CategoriaController = require('./Controllers/CategoriaController')

//Middleware
const { authentication } = require('./middleware')

//adicionar restaurante
routes.post('/signup', LoginController.signup)
routes.get('/restaurantes', LoginController.index)
routes.post('/login', LoginController.login)

//adicionar categoria
routes.post('/categoria', authentication, CategoriaController.store);

module.exports = routes;