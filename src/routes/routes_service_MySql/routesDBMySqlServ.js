const { inserirUsuario, loginUsuario } = require('../../services/db/mySql/mysql_con');
const absResposta = require('../../util/absRespostaServ');

// Abstração de resposta
function criarRespostaPersonalizada(overrides) {
    return { ...absResposta, ...overrides };
}

// Função para inserir um usuário
async function handleInserirUsuario(req, res) {
    const { usuario, endereco, contato } = req.body;

    try {
        const resultado = await inserirUsuario(usuario, endereco, contato);
    
        const resposta = criarRespostaPersonalizada({
            codigo: 201,
            mensagem: 'Usuário inserido com sucesso!',
            dados: resultado,
        });
        
        return res.status(201).send(resposta); 
    } catch (error) {
        const resultado = criarRespostaPersonalizada({
            codigo: 500,
            mensagem: `Parece que não tá legal! =(: ${error}`,
            erro: true,
            detalhesErro: { mensagem: error.message },
        });

        return res.status(500).send(resultado);
    }
}

// Função para login de usuário
async function handleLoginUsuario(req, res) {
    const { username, senha } = req.body;
  
    try {
        const usuario = await loginUsuario(username, senha);

        const resposta = criarRespostaPersonalizada({
            codigo: 200,
            mensagem: 'Usuário logado com sucesso!',
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
}

module.exports = {
    handleInserirUsuario,
    handleLoginUsuario
};
