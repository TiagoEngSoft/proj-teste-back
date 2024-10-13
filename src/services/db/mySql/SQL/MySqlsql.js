const inserirUsuario = () => {
    return `INSERT INTO USUARIO 
                (nome, senha, username, grupo_id) 
            VALUES 
                (?, ?, ?, ?)`;
};

const inserirEnderecoUsuario = () => {
    return `INSERT INTO ENDERECO 
                (usuario_id, logradouro, numero, complemento, bairro, cidade, estado, cep) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?)`;
};

const inserirContatoUsusairo = () => {
    return `INSERT INTO CONTATO 
                (usuario_id, email, telefone) 
            VALUES 
                (?, ?, ?)`;
};

function buscarUsuario() {
    return 'SELECT * FROM USUARIO WHERE username = ?';
  }

// Exportando as funções como um objeto
module.exports = {
   inserirUsuario, inserirEnderecoUsuario, 
   inserirContatoUsusairo, buscarUsuario
};