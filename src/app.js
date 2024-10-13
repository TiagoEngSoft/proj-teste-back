
// const http = require('http')
const express = require('express');
const cors = require('cors');
const moment = require('moment');
const path = require('path');
const https = require("https");
const fs = require('fs');
const { logRequest } = require('./middlewares/logMiddle');
const dotenv = require('dotenv');
dotenv.config();

//Config connection
const port = process.env.PORT || 3001;

const router = express();
router.use(logRequest);
router.use(express.static(path.join(__dirname, 'public')));// Define o diretório onde estão os arquivos estáticos
router.use(express.json());
router.use(cors());

//Import de rotas
const serviceFBDB = require('./routes/routes_service_FB/routesDBFB');
const serviceMySqlDB = require('./routes/routes_service_MySql/routesDBMySql');
const auth = require('./routes/auth/auth');
const maps = require('./routes/maps/maps');

// router.use('/serviceFB', serviceFBDB);
router.use(serviceFBDB);
router.use(serviceMySqlDB);
router.use(auth);
router.use(maps);

moment.locale('pt-br');

//Raiz -----------
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

//********************** Protocolo HTTPS  ****************************************
//tcp.port == 3000 && tls - Pesquisa Wireshark
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.crt')
// }, router).listen(PORT, () => {
//   console.log(`Serviço rodando em https://${HOSTNAME}:${PORT}`)
// })

//Protocolo HTTP
router.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

