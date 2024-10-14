require('dotenv').config();
const mysql = require('mysql2/promise');
const SQL = require('./SQL/MySqlsql');
const bcrypt = require('bcrypt');

// Configurações do pool de conexões
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306, 
  user: process.env.DB_USER || 'seu_usuario',
  password: process.env.DB_PASSWORD || 'sua_senha',
  database: process.env.DB_DATABASE || 'seu_banco_de_dados',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(poolConfig);

async function getDbConnectionFromPool() {
  try {
    return await pool.getConnection();
  } catch (err) {
    throw new Error('Erro ao obter conexão do pool de conexões: ' + err);
  }
}

async function inserirUsuario(usuarioData, enderecoData, contatoData) {
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
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao inserir usuário:', error);
    throw error; 
  } finally {
    connection.release(); // Liberar a conexão de volta para o pool
  }
}

async function loginUsuario(username, senha) {
  const connection = await getDbConnectionFromPool();

  try {
    // Consultar o usuário pelo username
    const query = buscarUsuario();
    const [rows] = await connection.query(query, [username]);

    if (rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    const usuario = rows[0];

    // Comparar a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      username: usuario.username,
      grupo_id: usuario.grupo_id,
      grupo_nome: usuario.nome,
    };
    
  } catch (error) {
    console.error('Erro ao logar usuário:', error);
    throw error;
  } finally {
    connection.release(); 
  }
}


module.exports = { inserirUsuario, loginUsuario, getDbConnectionFromPool };