const express = require('express');
const router = express.Router();
const { inserirUsuario, loginUsuario } = require('../controllers/userController');

// Rota para login
router.post('/login', loginUsuario);

// Rota para cadastro de usuário
router.post('/inserir', inserirUsuario);

module.exports = router;
