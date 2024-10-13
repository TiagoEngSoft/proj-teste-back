const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const gerenRotesApli = require('../gerenciadorRotas');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_TIME = process.env.TOKEN_EXPIRATION_TIME;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Rota de autenticação ----------
router.post(gerenRotesApli.auth.login, (req, res) => {
    const { username, password } = req.body;

    // Verifique se o nome de usuário e senha correspondem a um usuário válido
    if (username === 'eres' && password === '123456') {
        //Refresh token
        const refreshToken = jwt.sign({ username }, JWT_REFRESH_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });
        //Token
        const token = jwt.sign({ refreshToken }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });

        return res.json({ token, refreshToken });
    } else {
        // Usuário ou senha inválido, retorne uma mensagem de erro
        res.status(401).json({ message: 'Usuário ou senha inválido' });
    }
});

//Rota atualizacao de token
router.post(gerenRotesApli.auth.refreshToken, (req, res) => {
    const { refreshToken } = req.body;
    const token = jwt.sign({ refreshToken }, JWT_SECRET, { expiresIn: '20s' });
    return res.json({ token });
});

module.exports = router;
