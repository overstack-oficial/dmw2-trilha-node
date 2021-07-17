//Importações
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

//Variavel
const PORT = process.env.PORT || 8080;

//Invocação
const app = express();

require('./database');
require('./whatsapp');

//Middleware
app.use(cors());
app.use(express.json());

app.use(routes);

//Subindo o server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
})