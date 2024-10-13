let routesApi = {
    auth: {
        login: '/login',
        refreshToken: '/refresh'
    },
    maps: {
        localizacao: '/localizacao',
        utimaLatLon: '/ultimaLatLon',
        histLocaisVend: '/histLocVendedor'
    },
    serviceFB: {
        vendedores: '/vendedores',
        consultaFlex: '/consultaFlex'
    },
    serviceMySql: {
        inserirUsuario: '/inserirUsuario',
        loginUsuario: '/login'
    }
}

module.exports = routesApi;
