funciones = {
    isPrimeroMayor : function (date1AsString, date2AsString) {
        var arrayDate1 = date1AsString.split('-');
        var arrayDate2 = date2AsString.split('-');
        var date1 = new Date(arrayDate1[0],arrayDate1[1] - 1,arrayDate1[2]);
        var date2 = new Date(arrayDate2[0],arrayDate2[1] - 1,arrayDate2[2]);
        return date1>date2;
    }
};


constantes = {
    JNDI:"SIGED_NANTEC",
    JNDISAMPLE:"SampleData"
};


 
parametrosNoAtendidos = {
    startDate:"",
    endDate:"",
    gerencia:231,
    division:231,
    changeDate:false
};
var TMP_DATE = new Date();
TMP_DATE.setMonth(TMP_DATE.getMonth()-1);
var INITIAL_END_DATE_STRING = $.datepicker.formatDate('yy-mm-dd', new Date());
var INITIAL_START_DATE_STRING = $.datepicker.formatDate('yy-mm-dd', TMP_DATE);

QueryNoAtendidos={
    queryGerencia: function(){
        var query =  "select idunidad, nombre from unidad where dependencia = 231";			
        return query;
    },
    tablaPorRendimiento:function(){
        var query = "select customername as Customers, sum(amount) as sales from customers as c inner join payments as p  on  p.customernumber = c.customernumber group by customername having sum(amount) > 90000"
        return query;
    },
    queryPorDivision: function(SEDE_PARAM, FECHACREACION_D_F, FECHACREACION_H_F){
		
		var query ="SELECT /*+ USE_HASH(UDIG,UREMXR,UNREM,UREM,T,E,D) */ unrem.nombre as UNIDAD," +
                    "      COUNT(D.IDDOCUMENTO) as TOTAL_DOCUMENTOS" +
                    "  from DOCUMENTO D," +
                    "       expediente e," +
                    "       TRAZABILIDADDOCUMENTO T," +
                    "       USUARIO UREM," +
                    "       unidad unrem," +
                    "       usuarioxrol uremxr," +
                    "       usuario udig," +
                    "       sede sed" +
                    " WHERE udig.idusuario = t.destinatario" +
                    "   and udig.usuario like 'dig'" +
                    "   and (d.estado <> 'N'" +
                    "         OR d.propietario < t.destinatario" +
                    "         OR d.propietario > t.destinatario)" +
                    "   AND uremxr.idusuario = urem.idusuario" +
                    "   and uremxr.idrol = 2" +
                    "   AND t.idunidadremitente = unrem.idunidad" +
                    "   AND T.REMITENTE = UREM.IDUSUARIO" +
                    "   AND D.IDDOCUMENTO = T.DOCUMENTO" +
                    "   and T.ACCION = 1" +
                    "   AND e.idexpediente = d.expediente" +
                    "   and e.proceso not in (select IDPROCESO from proceso where (UPPER(nombre) like '%PRUEBA%' or UPPER(nombre) like ('%ZZZ%')))" +
                    "   AND d.fechacreacion >= to_date('" + FECHACREACION_D_F + "'||' 00:00','yyyy-MM-dd HH24:Mi')" +
                    "   AND to_date(to_char(d.fechacreacion,'yyyy-MM-dd hh24:Mi'),'yyyy-MM-dd hh24:Mi')  <= to_date('" + FECHACREACION_H_F + "'||' 23:59','yyyy-MM-dd HH24:Mi')" +
                    "   and sed.idsede = unrem.sede and (-1 in (" + SEDE_PARAM + ") OR sed.idsede in (" + SEDE_PARAM + "))" +
                    " group by UNREM.NOMBRE" +
                    " ORDER BY UNIDAD";

			
		return query;
	},
    queryTop5PorProceso: function(division, startDate, endDate){
		
		var query = "select ac.nombre, count(ex.idexpediente)as cantidad from expediente ex,documento dc, trazabilidaddocumento td, accion ac,unidad un " +
                     "where ex.idexpediente = dc.expediente and" +
                     "      td.idtrazabilidaddocumento =(select max(idtrazabilidaddocumento) from trazabilidaddocumento where documento = dc.iddocumento) and    " +
                     "      ac.idaccion = td.accion and" +
                     "      dc.principal = 'S' and dc.firmado ='N' and dc.enumerado = 'N' and" +
                     "      ac.nombre not in('reenviar','archivar')" +
                     "      and ex.fechacreacion BETWEEN TO_DATE ('"+ startDate+"', 'yyyy/mm/dd') AND TO_DATE ('" + endDate+ "', 'yyyy/mm/dd')" +
                     "      and un.idunidad =td.idunidaddestinatario and" +
                     "      un.idunidad in (select idunidad from unidad where dependencia = " + division + ")" +
                     "      group by ac.nombre" +
                     "      order by cantidad desc";
			
        return query;
    },
    queryTop5PorUsuario: function(division, startDate, endDate){
		
		var query = "select (select nombres from usuario where idusuario = destinatario) as usuario, cantidad from (" +
                         "select td.destinatario, count(ex.idexpediente)as cantidad from expediente ex,documento dc, trazabilidaddocumento td, accion ac,unidad un " +
                         "where ex.idexpediente = dc.expediente and" +
                         "      td.idtrazabilidaddocumento =(select max(idtrazabilidaddocumento) from trazabilidaddocumento where documento = dc.iddocumento) and    " +
                         "      ac.idaccion = td.accion and" +
                         "      dc.principal = 'S' and dc.firmado ='N' and dc.enumerado = 'N' and" +
                         "      ac.nombre not in('reenviar','archivar')" +
                         "      and ex.fechacreacion BETWEEN TO_DATE ('" + startDate + "', 'yyyy/mm/dd') AND TO_DATE ('" + endDate + "', 'yyyy/mm/dd')" +
                         "      and un.idunidad =td.idunidaddestinatario and" +
                         "      un.idunidad in (select idunidad from unidad where dependencia = " + division + ")" +
                         "      group by td.destinatario" +
                         "      order by cantidad desc" +
                         ") where rownum <6";
			
        return query;
    }
}