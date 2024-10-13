const express = require('express');
const router = express.Router();
const gerenciRotas = require('../../routes/gerenciadorRotas');
const {
    inserirUsuario,
    loginUsuario
} = require('../../services/db/mySql/mysql_con');
const absResposta = require('../../util/absRespostaServ');

//Abstracao de resposta
function criarRespostaPersonalizada(overrides) {
    return { ...absResposta, ...overrides };
}


// Inserir um usuário
router.post(gerenciRotas.serviceMySql.inserirUsuario, async (req, res) => {
    const { usuario, endereco, contato } = req.body;

    try {
        const resultado = await inserirUsuario(usuario, endereco, contato);
    
        const resposta = criarRespostaPersonalizada({
            codigo: 201,
            mensagem: 'Usuário inserido com sucesso!',
            dados: resultado,
        });
        
        return res.status(201).send(resposta); // Envia a resposta e para a execução aqui
    } catch (error) {

        const resultado = criarRespostaPersonalizada({
            codigo: 500,
            mensagem: `Parece que não tá legal! =(: ${error}`,
            erro: true,
            detalhesErro: { mensagem: error.message },
        });

        // Envia a resposta de erro
        return res.status(500).send(resultado); // Envia a resposta e para a execução aqui
    }
});

router.post(gerenciRotas.serviceMySql.loginUsuario, async (req, res) => {
    const { username, senha } = req.body;
  
    try {
      const usuario = await loginUsuario(username, senha);

      const resposta = criarRespostaPersonalizada({
        codigo: 200,
        mensagem: 'Usuário selecionado com sucesso!',
        dados: usuario,
    });

      res.status(200).json(resposta);
    } catch (error) {
      res.status(401).json(criarRespostaPersonalizada({
        codigo: 500,
        mensagem: `Parece que não tá legal! =(: ${error}`,
        erro: true,
        detalhesErro: { mensagem: error.message },
    }));
    }
  });

module.exports = router;