const Firebird = require('node-firebird');

const Obj = require('./SQL/FbSql');

const poolConfig = {
    host: '192.168.1.17',
    port: 3050,
    database: 'J:/Empresas/ce/backup-DB/SFI_CEPEDIDOS_A.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: null,
    pageSize: 4096,
};

const pool = Firebird.pool(8, poolConfig);

function getDbConnectionFromPool() {
    return new Promise((resolve, reject) => {
        pool.get((err, db) => {
            if (err) {
                reject('Erro ao obter conexão do pool: ' + err);
            } else {
                resolve(db);
            }
        });
    });
}

async function buscarContas() {
    const db = await getDbConnectionFromPool();
    return new Promise((resolve, reject) => {
        db.query(Obj.buscarContasSql(), (err, result) => { // Use sqlBuscarContas como a consulta SQL correta
            db.detach();
            if (err) {
                reject('Erro ao executar consulta: ' + err);
            } else {
                resolve({ result });
            }
        });
    });
}

async function buscarContasPaginada(tamanhoDaPagina = 50, numeroDaPagina = 1) {
    const db = await getDbConnectionFromPool();
    return new Promise((resolve, reject) => {
        db.query(Obj.buscaContasPaginadasSql(), (err, result) => {
            db.detach();
            if (err) {
                reject('Erro ao executar consulta: ' + err);
            } else {
                resolve({ result });
            }
        });
    });
}

async function consultaFlex(params) {
    const db = await getDbConnectionFromPool();
    return new Promise((resolve, reject) => {
        db.query(Obj.consultaFlexSql(), (err, result) => {
            db.detach();
            if (err) {
                reject('Erro ao executar consulta: ' + err);
            } else {
                resolve({ result });
            }
        });
    });
}

exports.buscarContas = buscarContas;
exports.buscarContasPaginada = buscarContasPaginada;
exports.consultaFlex = consultaFlex;
