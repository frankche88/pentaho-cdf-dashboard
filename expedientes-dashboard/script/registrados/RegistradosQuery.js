
RegistradosQuery = {
	//ROUND (ratio_to_report (SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE) * 100, 0) AS PORCENTAJE
    tableRegistrados:  function(filtersObject) {
		var filters = this.createFilters(filtersObject);
        var query = " SELECT  NOMBRE, ENTRADA, CANTIDAD, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"          FROM (         " +
					"                 SELECT  ENTRADA, NOMBRE ,SUM(SUBTOTAL) CANTIDAD, SUM(SUM(SUBTOTAL)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                 ( " +
					"                  SELECT NOMBRE, ENTRADA,SUM(SUBTOTAL) SUBTOTAL FROM( " +
					"                  SELECT    UNID.NOMBRE, " +
					"                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA, " +
					"                                     COUNT(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL " +
					"                      FROM DOCUMENTO DOCU " +
					"                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
					"                         WHERE DOCU.ESTAENFLUJO = 'S' " +
					"                          AND DOCU.ESTADO <> 'N' " +
					"                          AND EXPE.ESTADO <>'N' " +
					"                          AND DOCU.ESTADO IS NOT NULL " +
					filters +
					"                           GROUP BY UNID.NOMBRE,DOCU.AUTOR " +
					"                           )                     " +
					"                           GROUP BY NOMBRE,ENTRADA " +
					"                       ) " +
					"                   GROUP BY NOMBRE, ENTRADA  " +
					"                   ORDER BY NOMBRE       " +
					" ) " ;

		console.log("Tabla Registrados: " + query);	
        return query;
    },
    tableEnMesaDePartes: function(filtersObject) {
        var filters = this.createFilters(filtersObject);
        var query = " SELECT  NOMBRE, ENTRADA, CANTIDAD, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"          FROM (         " +
					"         SELECT  NOMBRE, ENTRADA, " +
					"                         SUM(SUBTOTAL) CANTIDAD " +
					"                         , SUM(SUM(SUBTOTAL)) OVER (PARTITION BY ENTRADA ) AS TOTAL  " +
					"                  FROM ( SELECT    PROC.NOMBRE, " +
					"                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA " +
					"                                     ,count(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL " +
					"                        FROM DOCUMENTO DOCU " +
					"                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
					"                         WHERE DOCU.ESTAENFLUJO = 'S' " +
					"                                 AND EXPE.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO IS NOT NULL  " +
					"                                 AND DOCU.AUTOR = 'Mesa de Partes' " +
					filters +
					"                         GROUP BY PROC.NOMBRE, DOCU.AUTOR " +
					"                ) " +
					"                   GROUP BY NOMBRE, ENTRADA  " +
					"                   ORDER BY NOMBRE " +
					" ) " ;
		console.log("Tabla enumerados: " + query);	
        return query;
	},
    tableEnUsuarioFinal: function(filtersObject) {                   
		var filters = this.createFilters(filtersObject);
        var query = " SELECT  NOMBRE, ENTRADA, CANTIDAD, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"          FROM (         " +
					"         SELECT  NOMBRE, ENTRADA, " +
					"                         SUM(SUBTOTAL) CANTIDAD " +
					"                         , SUM(SUM(SUBTOTAL)) OVER (PARTITION BY ENTRADA ) AS TOTAL  " +
					"                  FROM ( SELECT    PROC.NOMBRE, " +
					"                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA " +
					"                                     ,count(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL " +
					"                        FROM DOCUMENTO DOCU " +
					"                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
					"                         WHERE DOCU.ESTAENFLUJO = 'S' " +
					"                                 AND EXPE.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO IS NOT NULL  " +
					"                                 AND DOCU.AUTOR <> 'Mesa de Partes' " +
					filters +
					"                         GROUP BY PROC.NOMBRE, DOCU.AUTOR " +
					"                ) " +
					"                   GROUP BY NOMBRE, ENTRADA  " +
					"                   ORDER BY NOMBRE " +
					" ) " ;
		console.log("tabla enumerados y Registrados: " + query);	
        return query;
	},
    chartRegistrados: function(filtersObject) {	
        var filters = this.createFilters(filtersObject);
		var query = " SELECT  ENTRADA, NOMBRE, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"          FROM (         " +
					"                 SELECT  ENTRADA, NOMBRE ,SUM(SUBTOTAL) CANTIDAD, SUM(SUM(SUBTOTAL)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                 ( " +
					"                  SELECT NOMBRE, ENTRADA,SUM(SUBTOTAL) SUBTOTAL FROM( " +
					"                  SELECT    UNID.NOMBRE, " +
					"                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA, " +
					"                                     COUNT(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL " +
					"                      FROM DOCUMENTO DOCU " +
					"                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
					"                         WHERE DOCU.ESTAENFLUJO = 'S' " +
					"                          AND DOCU.ESTADO <> 'N' " +
					"                          AND EXPE.ESTADO <>'N' " +
					"                          AND DOCU.ESTADO IS NOT NULL " +
					filters +
					"                           GROUP BY UNID.NOMBRE,DOCU.AUTOR " +
					"                           )                     " +
					"                           GROUP BY NOMBRE,ENTRADA " +
					"                       ) " +
					"                   GROUP BY NOMBRE, ENTRADA  " +
					"                   ORDER BY NOMBRE       " +
					" ) " ;
		console.log("chart Registrados: " + query);
        return query;
	},
    chartEnMesaDePartes: function(filtersObject) {                   
		var filters = this.createFilters(filtersObject);
		var query = " SELECT  ENTRADA, NOMBRE, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"          FROM (         " +
					"         SELECT  NOMBRE, ENTRADA, " +
					"                         SUM(SUBTOTAL) CANTIDAD " +
					"                         , SUM(SUM(SUBTOTAL)) OVER (PARTITION BY ENTRADA ) AS TOTAL  " +
					"                  FROM ( SELECT    PROC.NOMBRE, " +
					"                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA " +
					"                                     ,count(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL " +
					"                        FROM DOCUMENTO DOCU " +
					"                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
					"                         WHERE DOCU.ESTAENFLUJO = 'S' " +
					"                                 AND EXPE.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO IS NOT NULL  " +
					"                                 AND DOCU.AUTOR = 'Mesa de Partes' " +
					filters +
					"                         GROUP BY PROC.NOMBRE, DOCU.AUTOR " +
					"                ) " +
					"                   GROUP BY NOMBRE, ENTRADA  " +
					"                   ORDER BY NOMBRE " +
					" ) " ;
		console.log("chart enumerados: " + query);
        return query;
	},
    chartEnUsuarioFinal: function(filtersObject) {                   
		var filters = this.createFilters(filtersObject);
		var query = " SELECT  ENTRADA, NOMBRE, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"          FROM (         " +
					"         SELECT  NOMBRE, ENTRADA, " +
					"                         SUM(SUBTOTAL) CANTIDAD " +
					"                         , SUM(SUM(SUBTOTAL)) OVER (PARTITION BY ENTRADA ) AS TOTAL  " +
					"                  FROM ( SELECT    PROC.NOMBRE, " +
					"                                     DECODE(DOCU.AUTOR,'Mesa de Partes','MESA DE PARTES','USUARIO FINAL') AS ENTRADA " +
					"                                     ,count(DISTINCT DOCU.IDDOCUMENTO) SUBTOTAL " +
					"                        FROM DOCUMENTO DOCU " +
					"                              INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                              INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                              INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                              INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                              INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                              INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                              INNER JOIN CLIENTE CLIE ON CLIE.IDCLIENTE = EXPE.CLIENTE " +
					"                         WHERE DOCU.ESTAENFLUJO = 'S' " +
					"                                 AND EXPE.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO <> 'N' " +
					"                                 AND DOCU.ESTADO IS NOT NULL  " +
					"                                 AND DOCU.AUTOR <> 'Mesa de Partes' " +
					filters +
					"                         GROUP BY PROC.NOMBRE, DOCU.AUTOR " +
					"                ) " +
					"                   GROUP BY NOMBRE, ENTRADA  " +
					"                   ORDER BY NOMBRE " +
					" ) " ;
		console.log("chart enumeradosRegistrados: " + query);
        return query;
	},
    createFilters : function (filtersObject) {
        var consulta = "";
        //objeto es quien carga toda la informacion proveniente de la interfaz para la consulta para el reporte 
        if(filtersObject){
                //cuando el usuario considera algun parametro 
            if(filtersObject.gerencia && filtersObject.gerencia != -1) {
                consulta += "   AND UNID.IDUNIDAD IN (" +
                            " SELECT UNID.IDUNIDAD FROM UNIDAD UNID " +
                            " WHERE UNID.IDUNIDAD IN (SELECT U.IDUNIDAD FROM UNIDAD U WHERE U.DEPENDENCIA = "+filtersObject.gerencia+" ) "+ 
                   " UNION ALL "+
                  " SELECT UNID1.IDUNIDAD FROM UNIDAD UNID1 WHERE UNID1.IDUNIDAD = "+filtersObject.gerencia+") "; 
                if(filtersObject.unidad && filtersObject.unidad != -1) {
                    consulta = "";
                    consulta += " AND UNID.IDUNIDAD = "+filtersObject.unidad+" ";
                }
            }
            if(filtersObject.usuario && filtersObject.usuario != -1) {
                consulta += " AND DOCU.PROPIETARIO  = "+filtersObject.usuario+" ";
            }
            if(filtersObject.flujo && -1 == $.inArray("-1", filtersObject.flujo)) {
                consulta += " AND PROC.IDPROCESO in ("+filtersObject.flujo+") ";
            }
            if(filtersObject.tipoDocumento && filtersObject.tipoDocumento!= -1) {
                consulta += " AND TIDO.IDTIPODOCUMENTO = "+filtersObject.tipoDocumento+" ";
            }
            if(filtersObject.cliente && filtersObject.cliente!= -1){
                consulta += "AND CLIE.IDCLIENTE = "+filtersObject.cliente+" ";
            }
            if(filtersObject.startDate != "") {
                consulta += " AND DOCU.FECHACREACION BETWEEN TO_DATE ('"+filtersObject.startDate+"'||' 00:00', 'yyyy/mm/dd HH24:Mi:ss') ";
            }
            if(filtersObject.endDate != "") {
                consulta += " AND TO_DATE ('"+filtersObject.endDate+"'||' 23:59:59', 'yyyy/mm/dd HH24:Mi:ss')";
            }
        }
        console.log(consulta);
        return consulta;
    }
}

