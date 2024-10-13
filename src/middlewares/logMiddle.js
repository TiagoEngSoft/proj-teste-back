const moment = require('moment');

exports.logRequest = (req, res, next) => {
    const start = new Date();
    const duration = Date.now() - start;
  
    const { method, url, headers, body, query, params, ip, protocol, path } = req;
    let agora = moment();
    // Registrando as informações da requisição
    console.log(`\n\n************* Reqisicao ****************`);
    console.log('Nova Requisição Recebida:');
    console.log("Data: " + agora.format('L LTS'));
    console.log('Método:', method);
    console.log('URL:', url);
    console.log('Cabeçalhos:', headers);
    console.log('Corpo:', body);
    console.log('Query:', query);
    console.log('Parâmetros:', params);
    console.log('IP:', ip);
    console.log('Protocolo:', protocol);
    console.log('Caminho:', path);
    console.log(`Tempo de Resposta: ${duration}ms`);
    next(); // Chama o próximo middleware na cadeia
  };