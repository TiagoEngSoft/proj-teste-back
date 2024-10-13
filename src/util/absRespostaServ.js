let absResposta = {
    codigo: -1,
    mensagem: '',
    usuario: { sectionId: '', nick: '' },
    dados: {},
    erro: false,
    detalhesErro: { mensagem: "" },
    metadados: {
        timestamp: new Date().toISOString(),
        pagina: '',
        tamanhoPagina: '',
        totalRegistros: '',
        versaoApi: '0.0.1'
    }

}

module.exports = absResposta;
