import { handleLoginUsuario } from '../src/routes/routes_service_MySql/routesDBMySqlServ'; // O caminho para o arquivo 1, adaptado ao seu projeto

export default function handler(req, res) {
    if (req.method === 'POST') {
        return handleLoginUsuario(req, res);
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
