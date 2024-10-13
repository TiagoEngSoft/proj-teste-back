const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/autenticacaoMiddle');
const gerenciRotasApli = require('../gerenciadorRotas');

//Definindo uma localizacao inicial
let ultimaLocalizacao = {
    latitude: -7.207927620173616,
    longitude: -39.313981388908644
};

//Simula banco que guarda localizacao e id 
let contador = 0;
let locais = [
    { latitude: -7.208223611993877, longitude: -39.31110600458255 },
    { latitude: -7.206417955227453, longitude: -39.30325159293676 },
    { latitude: -7.211833181829594, longitude: -39.29757383341781 },
    { latitude: -7.213726906102305, longitude: -39.28097131176772 }
];

//Rota que recebe uma localização  ---------
router.post(gerenciRotasApli.maps.localizacao, verifyToken, (req, res) => {
    ultimaLocalizacao = {
        latitude: req.body.latitude,
        longitude: req.body.longitude
    };
    contador++;
    locais.push(ultimaLocalizacao);

    //Monta resposta da requisicao
    let resposta = { "local": { "id": contador, "message": "Localizacao atualizada com sucesso!" } };
    console.log("Local: " + JSON.stringify(resposta));
    res.send(resposta);
});

//Rota que desponibiliza ultima localização recebida ----------
router.get(gerenciRotasApli.maps.utimaLatLon, verifyToken, (req, res) => {
    if (locais.length > 0) {
        return res.json(locais[locais.length - 1]);
    }
    res.json(ultimaLocalizacao);
});

//Busca o histórico de todas as localizacoes do dia de um vendedor específico
router.get(gerenciRotasApli.maps.histLocaisVend, (req, res) => {
    if (locais.length > 0) {
        return res.json(locais);
    }
    res.json([]);
});


module.exports = router;