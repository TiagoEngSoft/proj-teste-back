const { getDbConnectionFromPool } = require('../services/db/mySql/mysql_con');
const SQL = require('../services/db/mySql/SQL/MySqlsql');
const bcrypt = require('bcrypt');

// Função para inserir um novo usuário
async function inserirUsuario(req, res) {
    const { usuarioData, enderecoData, contatoData } = req.body;
    const connection = await getDbConnectionFromPool();

    try {
        await connection.beginTransaction();

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(usuarioData.senha, 10);

        // Inserir o usuário
        const insertUsuario = SQL.inserirUsuario();
        const [usuarioResult] = await connection.query(insertUsuario, [
            usuarioData.nome,
            hashedPassword,
            usuarioData.username,
            usuarioData.grupo_id
        ]);

        const usuarioId = usuarioResult.insertId;

        // Inserir o endereço
        const insertEndereco = SQL.inserirEnderecoUsuario();
        await connection.query(insertEndereco, [
            usuarioId,
            enderecoData.logradouro,
            enderecoData.numero,
            enderecoData.complemento,
            enderecoData.bairro,
            enderecoData.cidade,
            enderecoData.estado,
            enderecoData.cep
        ]);

        // Inserir o contato
        const insertContato = SQL.inserirContatoUsusairo();
        await connection.query(insertContato, [
            usuarioId,
            contatoData.email,
            contatoData.telefone
        ]);

        await connection.commit();
        console.log('Usuário inserido com sucesso!');
        res.status(201).json({ message: 'Usuário inserido com sucesso', usuarioId });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao inserir usuário:', error);
        res.status(500).json({ message: 'Erro ao inserir usuário', error: error.message });
    } finally {
        connection.release(); // Liberar a conexão de volta para o pool
    }
}

// Função para login de usuário
async function loginUsuario(req, res) {
    const { username, senha } = req.body;
    const connection = await getDbConnectionFromPool();

    try {
        // Consultar o usuário pelo username
        const query = SQL.buscarUsuario();
        const [rows] = await connection.query(query, [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const usuario = rows[0];

        // Comparar a senha fornecida com o hash armazenado
        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        // Retornar informações do usuário ao cliente
        const userInfo = {
            id: usuario.id,
            nome: usuario.nome,
            username: usuario.username,
            grupo_id: usuario.grupo_id,
            grupo_nome: usuario.grupo_nome,
        };

        res.status(200).json({ message: 'Login bem-sucedido', user: userInfo });
    } catch (error) {
        console.error('Erro ao logar usuário:', error);
        res.status(500).json({ message: 'Erro ao logar usuário', error: error.message });
    } finally {
        connection.release();
    }
}

// Exportando as funções
module.exports = {
    inserirUsuario,
    loginUsuario
};
