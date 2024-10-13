const { MongoClient } = require('mongodb');

// URL de conexão com o banco de dados MongoDB
const url = 'mongodb://localhost:27017'; // Exemplo de URL

// Nome do banco de dados
const dbName = 'nome-do-banco-de-dados';

// Estabelecer conexão com o banco de dados
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }

    console.log('Conectado ao banco de dados com sucesso');

    const db = client.db(dbName);

    // Exemplo de operação de leitura: consultar documentos em uma coleção
    const collection = db.collection('nome-da-colecao');

    collection.find({}).toArray(function (err, docs) {
        if (err) {
            console.error('Erro ao consultar documentos:', err);
            return;
        }

        console.log('Documentos encontrados:', docs);

        // Exemplo de operação de gravação: inserir documento em uma coleção
        const novoDocumento = { nome: 'Exemplo', idade: 30 };

        collection.insertOne(novoDocumento, function (err, result) {
            if (err) {
                console.error('Erro ao inserir documento:', err);
                return;
            }

            console.log('Documento inserido com sucesso:', result);

            // Exemplo de operação de atualização: atualizar documento em uma coleção
            const filtro = { nome: 'Exemplo' };
            const atualizacao = { $set: { idade: 31 } };

            collection.updateOne(filtro, atualizacao, function (err, result) {
                if (err) {
                    console.error('Erro ao atualizar documento:', err);
                    return;
                }

                console.log('Documento atualizado com sucesso:', result);

                // Exemplo de operação de exclusão: excluir documento em uma coleção
                collection.deleteOne(filtro, function (err, result) {
                    if (err) {
                        console.error('Erro ao excluir documento:', err);
                        return;
                    }

                    console.log('Documento excluído com sucesso:', result);

                    // Fechar conexão com o banco de dados após a execução das operações
                    client.close();
                });
            });
        });
    });
});
