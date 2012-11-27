// constants definitions
var TMP_DATE = new Date();
TMP_DATE.setMonth(TMP_DATE.getMonth()-1);
var INITIAL_END_DATE_STRING = $.datepicker.formatDate('yy-mm-dd', new Date());
var INITIAL_START_DATE_STRING = $.datepicker.formatDate('yy-mm-dd', TMP_DATE);
// functions definitions
functions = {
    isFirstGreat : function (date1AsString, date2AsString) {
        var arrayDate1 = date1AsString.split('-');
        var arrayDate2 = date2AsString.split('-');
        var date1 = new Date(arrayDate1[0],arrayDate1[1] - 1,arrayDate1[2]);
        var date2 = new Date(arrayDate2[0],arrayDate2[1] - 1,arrayDate2[2]);
        return date1>date2;
    }
};


constants = {
    JNDI:"SIGED_NANTEC",
    JNDISAMPLE:"SampleData"
};
// parameters definitions
parameters = {
    gerencia:-1,
    unidad:-1,
    usuario:-1,
    flujo:["-1"],
    cliente:-1,
    tipoDocumento:-1,
    startDate:INITIAL_START_DATE_STRING,
    endDate:INITIAL_END_DATE_STRING,
    runConsult:false
}
// select definitions
SelectQueryDefinition =  {
    
    gerenciaQueryDefinition : {
        queryType: 'sql',
		jndi: constants.JNDI,
        query: function(){
            var query = " select -1 as idunidad,'TODOS' as nombre from dual" +
                        " union all" +
                        " select * from (" +
                        " select a.idunidad, a.nombre" +
                        " from UNIDAD a" +
                        " where a.dependencia = 231" +
                        " order by 2" +
                        " )";
            console.log(query);
            return query;
        }
    },
    undadQueryDefinition : {
        queryType: 'sql',
		jndi: constants.JNDI,
        query: function(){
            var query = " select -1 as idunidad,'TODOS' as nombre from dual" +
                        " union all" +
                        " select * from (" +
                        " select a.idunidad, a.nombre" +
                        " from UNIDAD a" +
                        " where a.dependencia = " + parameters.gerencia +
                        " order by 2" +
                        " )";
            console.log(query);
            return query;
        }
    },
    usuarioQueryDefinition : {
        queryType: 'sql',
		jndi: constants.JNDI,
        query: function(){
            var unidad = parameters.unidad;
            if(unidad == -1){
                unidad = parameters.gerencia;
            }
            var query = " select -1 as idusuario,'TODOS' as nombre from dual" +
                        " union all" +
                        " select * from (" +
                        " select a.idusuario, a.nombres" +
                        " from usuario a" +
                        " where a.IDUNIDAD = " + unidad +
                        " order by a.nombres" +
                        " )";
            console.log(query);
            return query;
        }
    },
    flujoQueryDefinition : {
        queryType: 'sql',
		jndi: constants.JNDI,
        query: function(){
            var query = " select -1 as idproceso,'TODOS' as nombre from dual" +
                        " union all" +
                        " select * from (" +
                        " select idproceso, nombre" +
                        " from PROCESO" +
                        " order by 2" +
                        " )";
            console.log(query);
            return query;
        }
    },
    clienteQueryDefinition : {
        queryType: 'sql',
		jndi: constants.JNDI,
        query: function(){
            var query = " select -1 as idcliente,'TODOS' as razonsocial from dual" +
                        " union all" +
                        " select * from (select idcliente, razonsocial" +
                        " from cliente a" +
                        //" where idcliente = " + parameters.cliente +
                        " order by 2)";
            console.log(query);
            return query;
        }
    },
    tipoDocumentoQueryDefinition: {
        queryType: 'sql',
		jndi: constants.JNDI,
        query: function(){
            var query = " select -1, 'TODOS' AS nombre from dual" +
                        " union all" +
                        " select * from (" +
                        " select idtipodocumento, nombre from tipodocumento where estado ='A' order by nombre " +
                        " )";
            console.log(query);
            return query;
        }
    }
};

barcharColor = {
    colors:{"NO ATENDIDO":"red","ATENDIDO":"green",
        "NO ENUMERADOS":"red","ENUMERADOS":"green",
        "NO FIRMADO":"red","FIRMADO":"green",
        "NO ENUMERADOS Y FIRMADO":"red","ENUMERADOS Y FIRMADO":"green",
    },
    colorSelector:function(serie){
        var fillColor = null;
        for( idx in barcharColor.colors) {
            if(idx == serie) {
                fillColor = barcharColor.colors[idx];
                break;
            }
        }
        return fillColor;
    }
}

