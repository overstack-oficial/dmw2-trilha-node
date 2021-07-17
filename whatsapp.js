require('dotenv').config();
const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

//models
const Restaurante = require('./src/Models/Restaurante');
const Cliente = require('./src/Models/Cliente');
const Contexto = require('./src/Models/Contexto');

const SESSION_PATH = process.env.SESSION_PATH;

let sessionConfig;
if (fs.existsSync(SESSION_PATH)) {
  sessionConfig = require(SESSION_PATH);
}

let client = new Client({
  session: sessionConfig
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Authenticated');
  sessionConfig = session;
  fs.writeFile(SESSION_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', (session) => {
  sessionConfig = '';
  console.log(session, 'não foi possível entrar no wp');
  fs.writeFile(SESSION_PATH, JSON.stringify(sessionConfig), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', (message) => {
  let [phone, type] = message.from.split('@');
  phone = phone.substring(2);
  if (type == 'c.us') {
    clientMessage(phone, message);
  }
});

client.initialize();

const sendMessage = async (number, text) => {
  const phone = `55${number}@c.us`;
  const message = text || "Algo deu errado com a mensagem";
  try {
    await client.sendMessage(phone, message)
  } catch(err){
    console.log(err)
  }
}

//todas as mensagens passam por está função
const clientMessage = async (phone, message) => {

  try {
    //Pegar o numero para qual a mensagem está sendo enviada
    let [restauranteTelefone,] = message.to.split('@');
    //formata o numero do restaurante sem o 55
    restauranteTelefone = restauranteTelefone.substring(2);

    //pegar o cliente do corpo da mensagem recebida pelo WA
    let [clienteTelefone,] = message.from.split('@');
    //formata o numero do cliente sem o 55
    clienteTelefone = clienteTelefone.substring(2);

    //consultar se esse restaurante existe no bd
    let restaurant = await Restaurante.findOne({ telefone: restaurante });
    //verificar se o cliente existe nesse restaurante;
    let cliente = await Cliente.findOne({ telefone: clienteTelefone, restauranteId: restaurant._id})

    if(!cliente) {
      const contato = await message.getContact()
      cliente = await Cliente.create({
        nome: contato.pushname || contato.verifiedName,
        telefone: clienteTelefone,
        restauranteId: restaurant._id
      })
    } 

    //buscar contexto do usuário
    let contexto = await Contexto.findOne({ clienteId: cliente._id });

    //Se contexto não existe, gravar contexto de boas vindas

    if (!contexto) {
      contexto = await Contexto.create({
        tipo: 'welcome',
        clienteId: cliente._id
      })
    }

    if(message.location){
      //verificar se usuario tem alguma localização e editar ou gravar pela primeira vez
      cliente = await Cliente.findByIdAndUpdate(
        cliente._id,
        { 
          endereco: {
            coordinates: [message.location.latitude, message.location.longitude] 
          }
        }, 
        { new: true }
      )
      await Contexto.findByIdAndUpdate(
        contexto._id, 
        {
          tipo: "address"
        },
        {
          new: true
        }
      )

      //enviar mensagem pedindo o número da residencia
      sendMessage(cliente.telefone, "Informe o número da residência")
    } else {
      let text = message.body.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); //não -> nao

      //swith case
      switch (text) {
        case 'sim':
          sendMessage(cliente.telefone, "Sim")
          break;
        case 'nao':
          sendMessage(cliente.telefone, "Não")
          break;
        case 'pedido':
          sendMessage(cliente.telefone, "Pedido")
          break;
        case 'cancelar':
          console.log('cancelas')
          break;
        case 'instrucoes':
          console.log('instrucoes')
          break;
      
        default:
          console.log('default')
          break;
      }
    }
  } catch(err) {
    console.error(err)
  }
  
}