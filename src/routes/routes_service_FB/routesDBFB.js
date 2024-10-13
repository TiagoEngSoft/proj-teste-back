const express = require('express');
const router = express.Router();
const gerenciRotas = require('../../routes/gerenciadorRotas');

const {
    buscarContas,
    buscarContasPaginada,
    consultaFlex
} = require('../../services/db/firebird/fdb_con');
const absResposta = require('../../util/absRespostaServ');

function criarRespostaPersonalizada(overrides) {
    return { ...absResposta, ...overrides };
}

// Busca de vendedores
router.get(gerenciRotas.serviceFB.vendedores, async (req, res) => {
    let resposta;
    try {
        const resultado = await buscarContas();
        resposta = criarRespostaPersonalizada({
            codigo: 200,
            mensagem: 'Deu bom artista! ;)',
            dados: resultado,
        });
        return res.status(resposta.codigo).json(resposta);
    } catch (error) {
        resposta = criarRespostaPersonalizada({
            codigo: 500,
            mensagem: `Parece que não tá legal! =(: ${error}`,
            erro: true,
            detalhesErro: { mensagem: error.message },
        });

    }
    console.log(resposta);
    res.status(resposta.codigo).json(resposta);
});

// Resumo flex
router.get(gerenciRotas.serviceFB.consultaFlex, async (req, res) => {
    try {
        const resultado = await consultaFlex();
        const resposta = criarRespostaPersonalizada({
            codigo: 200,
            mensagem: 'Deu bom artista! ;)',
            dados: resultado,
        });
        res.status(resposta.codigo).json(resposta);
    } catch (error) {
        const resposta = criarRespostaPersonalizada({
            codigo: 500,
            mensagem: 'Parece que não tá legal! =(',
            erro: true,
            detalhesErro: { mensagem: error.message },
        });
        res.status(resposta.codigo).json(resposta);
    }
});

module.exports = router;
