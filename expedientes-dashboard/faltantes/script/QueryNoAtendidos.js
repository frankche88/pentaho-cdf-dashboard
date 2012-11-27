
QueryNoAtendidos = {
    tablaAtendidosVsNo:  function(filtersObject) {
		var filters = this.createFilters(filtersObject);
		//var query = "select productcode, ordernumber, sum(quantityordered)as cantidad from orderdetails where priceeach > 245 group by productcode, ordernumber order by 1,2";
        var query = "SELECT  (CASE EXPE.ESTADO" +
                    "                WHEN  'A' THEN 'NO ATENDIDO'" +
                    "                WHEN  'I' THEN 'ATENDIDO'" +
                    "               END " +
                    "                ) AS ESTADO, UNID.NOMBRE, " +
                    "                 COUNT(DISTINCT EXPE.NROEXPEDIENTE) AS CANTIDAD" +
                    " FROM DOCUMENTO DOCU" +
                    "        INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE" +
                    "        INNER JOIN USUARIO USUA ON DOCU.PROPIETARIO = USUA.IDUSUARIO" +
                    "        INNER JOIN UNIDAD UNID ON USUA.IDUNIDAD = UNID.IDUNIDAD" +
                    "        INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO" +
                    "        INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
                    " WHERE EXPE.ESTADO<>'N' " +
                    "        AND DOCU.ESTAENFLUJO = 'S'       " +
                    filters +
                    "        GROUP BY UNID.NOMBRE,EXPE.ESTADO" +
                    "        ORDER BY 2, 1";
		console.log(query);	
        return query;
    },
    flujoNoatendidos: function(filtersObject) {		
        var filters = this.createFilters(filtersObject);
		var query = " SELECT  PROC.NOMBRE, " +
                    "                 COUNT(DISTINCT EXPE.NROEXPEDIENTE) AS ATENDIDO" +
                    " FROM DOCUMENTO DOCU" +
                    "        INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE" +
                    "        INNER JOIN USUARIO USUA ON DOCU.PROPIETARIO = USUA.IDUSUARIO" +
                    "        INNER JOIN UNIDAD UNID ON USUA.IDUNIDAD = UNID.IDUNIDAD" +
                    "        INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO" +
                    "        INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE" +
                    " WHERE EXPE.ESTADO<>'N' " +
                    "        AND EXPE.ESTADO = 'A' " +
                    "        AND DOCU.ESTAENFLUJO = 'S'" +
                    filters +
                    " GROUP BY PROC.NOMBRE" +
                    "        ORDER BY PROC.NOMBRE"
        console.log(query);            
		return query;
	},
    flujoAtendidos: function(filtersObject) {	
        var filters = this.createFilters(filtersObject);
		var query = " SELECT  PROC.NOMBRE, " +
                    "                 COUNT(DISTINCT EXPE.NROEXPEDIENTE) AS ATENDIDO" +
                    " FROM DOCUMENTO DOCU" +
                    "        INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE" +
                    "        INNER JOIN USUARIO USUA ON DOCU.PROPIETARIO = USUA.IDUSUARIO" +
                    "        INNER JOIN UNIDAD UNID ON USUA.IDUNIDAD = UNID.IDUNIDAD" +
                    "        INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO" +
                    "        INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE" +
                    " WHERE EXPE.ESTADO<>'N' " +
                    "        AND EXPE.ESTADO = 'I' " +
                    "        AND DOCU.ESTAENFLUJO = 'S'" +
                    filters +
                    " GROUP BY PROC.NOMBRE" +
                    "        ORDER BY PROC.NOMBRE"
		console.log(query);
        return query;
	},
    chartAtendidosVsNo: function(filtersObject) {
		var filters = this.createFilters(filtersObject);
		//var query = "select productcode, ordernumber, sum(quantityordered)as cantidad from orderdetails where priceeach > 245 group by productcode, ordernumber order by 1,2";
        var query = "SELECT  (CASE EXPE.ESTADO" +
                    "                WHEN  'A' THEN 'NO ATENDIDO'" +
                    "                WHEN  'I' THEN 'ATENDIDO'" +
                    "               END " +
                    "                ) AS ESTADO, UNID.NOMBRE, " +
                    "                 COUNT(DISTINCT EXPE.NROEXPEDIENTE) AS CANTIDAD" +
                    " FROM DOCUMENTO DOCU" +
                    "        INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE" +
                    "        INNER JOIN USUARIO USUA ON DOCU.PROPIETARIO = USUA.IDUSUARIO" +
                    "        INNER JOIN UNIDAD UNID ON USUA.IDUNIDAD = UNID.IDUNIDAD" +
                    "        INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO" +
                    "        INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
                    " WHERE EXPE.ESTADO<>'N' " +
                    "        AND DOCU.ESTAENFLUJO = 'S'       " +
                    filters +
                    "        GROUP BY UNID.NOMBRE,EXPE.ESTADO" +
                    "        ORDER BY 1, 2";
			
        console.log(query);
        return query;
    },
    createFilters : function (filtersObject) {
        var consulta = "";
        //objeto es quien carga toda la informacion proveniente de la interfaz para la consulta para el reporte 
        if(filtersObject){
                //cuando el usuario considera algun parametro 
              if(filtersObject.gerencia != -1) {
                consulta += "   AND UNID.IDUNIDAD IN (" +
                                " SELECT UNID.IDUNIDAD FROM UNIDAD UNID " +
                                " WHERE UNID.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = "+filtersObject.gerencia+" ) "+ 
                       " UNION ALL "+
                       " SELECT UNID1.IDUNIDAD FROM UNIDAD UNID1 WHERE UNID1.IDUNIDAD = "+filtersObject.gerencia+") "; 
              }  
              if(filtersObject.unidad != -1) {
                consulta += " AND UNID.IDUNIDAD = "+filtersObject.unidad+" ";
              }
              if(filtersObject.usuario != -1) {
                consulta += " AND EXPE.IDPROPIETARIO  = "+filtersObject.usuario+" ";
              }
              if(filtersObject.flujo != -1) {
                consulta += " AND PROC.IDPROCESO = "+filtersObject.flujo+" ";
              }
              if(filtersObject.cliente!= -1) {
                consulta += " AND CLIE.IDCLIENTE = "+filtersObject.cliente+" ";
              }
              if(filtersObject.startDate != "") {
                consulta += " AND EXPE.FECHACREACION BETWEEN TO_DATE ('"+filtersObject.startDate+"'||' 00:00', 'yyyy-mm-dd HH24:Mi') ";
                }
              if(filtersObject.endDate != "") {
                consulta += " AND TO_DATE ('"+filtersObject.endDate+"'||' 23:59', 'yyyy-mm-dd HH24:Mi')";
              }
        }
        console.log(consulta);
        return consulta;
    }
}

