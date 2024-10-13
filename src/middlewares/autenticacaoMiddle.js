const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Validar token de autenticação
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    // Verificar se o token foi fornecido
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    // Verificar se o token é válido
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // Verificar se o token expirou
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado' });
            } else {
                // Outro erro na verificação do token
                return res.status(403).json({ message: 'Falha na autenticação do token' });
            }
        } else {
            // Token válido, definir o usuário no request e prosseguir
            req.user = decoded.username;
            req.token = token;
            next();
        }
    });
};

//Recarregar a validade do token
exports.verifyRefreshToken = (req, res, next) => {
    const { refreshToken } = req.body;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}