const consultaFlexSql = ({ dataInicio = '01/01/2024', dataFim = '10/01/2024', tipoPedido = 'S', vendedorId = -1, estoque = '' }) => {
    return `
        SELECT 
            Vendedorid, 
            nome_fantasia,
            SUM(quantidade_venda) quantidade, 
            SUM(quantidade_venda * preco) / SUM(quantidade_venda) pr_tabela,
            SUM(quantidade_venda * preco) Total_Bruto, 
            SUM(quantidade_venda * pr_venda_liquido) / SUM(quantidade_venda) pr_venda_liquido,
            SUM(quantidade_venda * pr_venda_liquido) Total_Liquido,
            SUM(quantidade_venda * pr_tabela) Total_Pr_Tabela, 
            SUM(quantidade_venda * (pr_venda_liquido - pr_tabela)) Flex
        FROM ( 
            SELECT
                Vendedorid,
                nome_fantasia,
                produtoid,
                descricao,
                quantidade_venda,
                preco,
                pr_venda_liquido,
                pr_tabela,
                (quantidade_venda * preco) Total_Bruto,
                (quantidade_venda * pr_venda_liquido) Total_Liquido,
                (quantidade_venda * pr_tabela) Total_Pr_Tabela,
                (quantidade_venda * (pr_venda_liquido - pr_tabela)) Flex
            FROM (
                SELECT
                    p.vendedorid,
                    v.nome_fantasia,
                    i.produtoid,
                    pr.descricao,
                    SUM(IIF(p.classe_pedido = 'E', 0, i.quantidade)) quantidade_venda,
                    SUM(IIF(p.classe_pedido = 'E', i.quantidade, 0)) quantidade_devolucao,
                    CAST(SUM(CAST(i.preco AS NUMERIC(15,6)) * i.quantidade) / SUM(i.quantidade) AS NUMERIC(15,2)) Preco,
                    CAST(SUM(i.valor_contabil) / SUM(i.quantidade) AS NUMERIC(15,2)) Pr_Venda_Liquido,
                    CAST(SUM(i.quantidade * IIF(COALESCE(i.pr_t, 0) > 0, i.pr_t, IIF(COALESCE(t.preco_venda, 0) > 0, t.preco_venda, t.preco_avista))) / SUM(i.quantidade) AS NUMERIC(15,2)) PR_Tabela
                FROM pedido p
                JOIN item i ON i.pedidoid = p.pedidoid
                JOIN produto pr ON pr.produtoid = i.produtoid
                JOIN conta v ON v.contaid = p.vendedorid
                JOIN politica_preco t ON t.produtoid = i.produtoid AND t.tabelaid = i.tabela_preco
                WHERE p.data_contabilizacao BETWEEN '${dataInicio}' AND '${dataFim}'
                    AND (P.classe_pedido = '${tipoPedido}' AND P.Tipo_Pedido = COALESCE('${tipoPedido}', 'S') OR (P.classe_pedido = 'E' AND P.Tipo_Pedido = 'D'))
                    AND (P.tipo_de_venda <> 'R' OR P.tipo_de_venda IS NULL)
                    AND p.vendedorid = ${vendedorId >= 0 ? `'${vendedorId}'` : 'p.vendedorid'}
                    AND I.CONTA_ESTOQUE = COALESCE('${estoque}', i.conta_estoque)
                GROUP BY 1,2,3,4
            ) A
        ) B
        GROUP BY 1, 2
        ORDER BY flex DESC
    `;
};

const buscarContasSql = () => {
    return `
    SELECT 
        c.CONTAID,
        c.NOME, c.UF
    FROM CONTA c 
    JOIN conta_aux ca ON ca.contaid = c.contaid
    WHERE 
        c.CLASSE CONTAINING 'W' AND COALESCE(ca.STATUS, 'A') <> 'S'`;
};

const buscaContasPaginadasSql = (tamanhoDaPagina = 50, numeroDaPagina = 1) => {
    const inicio = (numeroDaPagina - 1) * tamanhoDaPagina + 1;
    const fim = inicio + tamanhoDaPagina - 1; // Ajuste para definir corretamente o intervalo
    return `
    SELECT
        c.CONTAID, c.NOME_FANTASIA, c.UF
    FROM CONTA c 
    JOIN conta_aux ca ON ca.contaid = c.contaid
    WHERE 
        c.CLASSE CONTAINING 'W'
        AND COALESCE(ca.STATUS, 'A') <> 'S'
    ROWS ${inicio} TO ${fim}`;
};

// Exportando as funções como um objeto
module.exports = {
    buscarContasSql,
    buscaContasPaginadasSql,
    consultaFlexSql
};
