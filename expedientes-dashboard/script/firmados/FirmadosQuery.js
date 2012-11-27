
FirmadosQuery = {
	//ROUND (ratio_to_report (SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE) * 100, 0) AS PORCENTAJE
    tableFirmados:  function(filtersObject) {
		var filters = this.createFilters(filtersObject);
        var query = " SELECT   ESTADO, NOMBRE, CANTIDAD,TOTAL,ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"        FROM ( " +
					"                   SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                                 ( " +
					"                        SELECT    UNID.NOMBRE, " +
					"                                        (CASE DOCU.FIRMADO " +
					"                                                 WHEN  'S' THEN 'FIRMADOS' " +
					"                                                 WHEN  'N' THEN 'NO FIRMADOS' " +
					"                                                END  " +
					"                                                 ) AS ESTADO, " +
					"                                                  " +
					"                                         COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD                                         " +
					"                                  FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                                 WHERE EXPE.ESTADO<>'N'  " +
					"                                         AND DOCU.ESTADO <> 'N' " +
					"                                         AND DOCU.ESTAENFLUJO = 'S' " +
					"                                         AND DOCU.FIRMADO ='S' " +
					filters +
					"                                         GROUP BY UNID.NOMBRE, DOCU.FIRMADO " +
					"                                   ) GROUP BY ESTADO, NOMBRE " +
					" )                                    " ;
		console.log("Tabla firmados: " + query);	
        return query;
    },
    tableEnumerados: function(filtersObject) {
        var filters = this.createFilters(filtersObject);
        var query = " SELECT   ESTADO, NOMBRE, CANTIDAD,TOTAL,ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
					"        FROM ( " +
					" SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                 (   SELECT    UNID.NOMBRE, " +
					"                        (CASE DOCU.ENUMERADO " +
					"                                 WHEN  'S' THEN 'ENUMERADOS' " +
					"                                 WHEN  'N' THEN 'NO ENUMERADOS' " +
					"                                END  " +
					"                                 ) AS ESTADO , " +
					"                            COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD " +
					"                 FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE                " +
					"                 WHERE EXPE.ESTADO<>'N'  " +
					"                         AND DOCU.ESTADO <> 'N' " +
					"                         AND DOCU.ESTAENFLUJO = 'S' " +
					"                         AND DOCU.ENUMERADO ='S' " +
					filters +
					"                GROUP BY UNID.NOMBRE, DOCU.ENUMERADO     " +
					"                    )GROUP BY ESTADO, NOMBRE " +
					"             )                      ";
		console.log("Tabla enumerados: " + query);	
        return query;
	},
    tableEnumeradosFirmados: function(filtersObject) {                   
		var filters = this.createFilters(filtersObject);
        var query = " SELECT   ESTADO, NOMBRE, CANTIDAD,TOTAL,ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
					"        FROM ( " +
					"        SELECT ESTADO, NOMBRE,CANTIDAD, TOTAL FROM ( " +
					" SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                 (   SELECT    UNID.NOMBRE, " +
					"                                 'ENUMERADOS Y FIRMADOS' AS ESTADO , " +
					"                            COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD " +
					"                 FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE                " +
					"                 WHERE EXPE.ESTADO<>'N'  " +
					"                         AND DOCU.ESTADO <> 'N' " +
					"                         AND DOCU.ESTAENFLUJO = 'S' " +
					"                         AND DOCU.FIRMADO = 'S' " +
					"                         AND DOCU.ENUMERADO ='S' " +
					filters +
					"                GROUP BY UNID.NOMBRE, DOCU.ENUMERADO " +
					"                UNION  " +
					"                 SELECT    UNID.NOMBRE, " +
					"                           'NO ENUMERADOS Y FIRMADOS' AS ESTADO , " +
					"                           COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD " +
					"                 FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE                " +
					"                 WHERE NOT( DOCU.FIRMADO = 'S' AND DOCU.ENUMERADO ='S') " +
					"                         AND ( DOCU.ESTADO <> 'N') " +
					"                         AND (DOCU.ESTAENFLUJO = 'S') " +
					"                         AND (EXPE.ESTADO<>'N' ) " +
					filters +
					"                GROUP BY UNID.NOMBRE, DOCU.ENUMERADO " +
					"                    )GROUP BY ESTADO, NOMBRE                    " +
					"             ) WHERE ESTADO IS NOT NULL " +
					"      )                      ";
		console.log("tabla enumerados y firmados: " + query);	
        return query;
	},
    chartFirmados: function(filtersObject) {	
        var filters = this.createFilters(filtersObject);
		var query = " SELECT   ESTADO, NOMBRE, ROUND((CANTIDAD/TOTAL)*100,0) AS PORCENTAJE  " +
					"        FROM ( " +
					"                   SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                                 ( " +
					"                        SELECT    UNID.NOMBRE, " +
					"                                        (CASE DOCU.FIRMADO " +
					"                                                 WHEN  'S' THEN 'FIRMADOS' " +
					"                                                 WHEN  'N' THEN 'NO FIRMADOS' " +
					"                                                END  " +
					"                                                 ) AS ESTADO, " +
					"                                                  " +
					"                                         COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD                                         " +
					"                                  FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE " +
					"                                 WHERE EXPE.ESTADO<>'N'  " +
					"                                         AND DOCU.ESTADO <> 'N' " +
					"                                         AND DOCU.ESTAENFLUJO = 'S' " +
					"                                         AND DOCU.FIRMADO ='S' " +
					filters +
					"                                         GROUP BY UNID.NOMBRE, DOCU.FIRMADO " +
					"                                   ) GROUP BY ESTADO, NOMBRE " +
					" )                                    " ;
		console.log("chart firmados: " + query);
        return query;
	},
    chartEnumerados: function(filtersObject) {                   
		var filters = this.createFilters(filtersObject);
		var query = " SELECT   ESTADO, NOMBRE, ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
					"        FROM ( " +
					" SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                 (   SELECT    UNID.NOMBRE, " +
					"                        (CASE DOCU.ENUMERADO " +
					"                                 WHEN  'S' THEN 'ENUMERADOS' " +
					"                                 WHEN  'N' THEN 'NO ENUMERADOS' " +
					"                                END  " +
					"                                 ) AS ESTADO , " +
					"                            COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD " +
					"                 FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE                " +
					"                 WHERE EXPE.ESTADO<>'N'  " +
					"                         AND DOCU.ESTADO <> 'N' " +
					"                         AND DOCU.ESTAENFLUJO = 'S' " +
					"                         AND DOCU.ENUMERADO ='S' " +
					filters +
					"                GROUP BY UNID.NOMBRE, DOCU.ENUMERADO     " +
					"                    )GROUP BY ESTADO, NOMBRE " +
					"             )                      ";
		console.log("chart enumerados: " + query);
        return query;
	},
    chartEnumeradosFirmados: function(filtersObject) {                   
		var filters = this.createFilters(filtersObject);
		var query = " SELECT   ESTADO, NOMBRE, ROUND((CANTIDAD/DECODE(TOTAL,0,1,TOTAL))*100,0) AS PORCENTAJE  " +
					"        FROM ( " +
					"        SELECT ESTADO, NOMBRE,CANTIDAD, TOTAL FROM ( " +
					" SELECT  ESTADO, NOMBRE ,SUM(CANTIDAD) CANTIDAD, SUM(SUM(CANTIDAD)) OVER (PARTITION BY NOMBRE ) AS TOTAL FROM " +
					"                 (   SELECT    UNID.NOMBRE, " +
					"                                 'ENUMERADOS Y FIRMADOS' AS ESTADO , " +
					"                            COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD " +
					"                 FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE                " +
					"                 WHERE EXPE.ESTADO<>'N'  " +
					"                         AND DOCU.ESTADO <> 'N' " +
					"                         AND DOCU.ESTAENFLUJO = 'S' " +
					"                         AND DOCU.FIRMADO = 'S' " +
					"                         AND DOCU.ENUMERADO ='S' " +
					filters +
					"                GROUP BY UNID.NOMBRE, DOCU.ENUMERADO " +
					"                UNION  " +
					"                 SELECT    UNID.NOMBRE, " +
					"                           'NO ENUMERADOS Y FIRMADOS' AS ESTADO , " +
					"                           COUNT(DISTINCT DOCU.IDDOCUMENTO) AS CANTIDAD " +
					"                 FROM DOCUMENTO DOCU " +
					"                                         INNER JOIN EXPEDIENTE EXPE ON DOCU.EXPEDIENTE = EXPE.IDEXPEDIENTE " +
					"                                         INNER JOIN TIPODOCUMENTO TIDO ON TIDO.IDTIPODOCUMENTO = DOCU.TIPODOCUMENTO " +
					"                                         INNER JOIN PROCESO PROC ON PROC.IDPROCESO = EXPE.PROCESO " +
					"                                         INNER JOIN TRAZABILIDADDOCUMENTO TRDO ON TRDO.DOCUMENTO = DOCU.IDDOCUMENTO and TRDO.NROREGISTRO = 1 " +
					"                                         INNER JOIN USUARIO USUA ON TRDO.REMITENTE = USUA.IDUSUARIO  " +
					"                                         INNER JOIN UNIDAD UNID ON UNID.IDUNIDAD = TRDO.IDUNIDADREMITENTE                " +
					"                 WHERE NOT( DOCU.FIRMADO = 'S' AND DOCU.ENUMERADO ='S') " +
					"                         AND ( DOCU.ESTADO <> 'N') " +
					"                         AND (DOCU.ESTAENFLUJO = 'S') " +
					"                         AND (EXPE.ESTADO<>'N' ) " +
					filters +
					"                GROUP BY UNID.NOMBRE, DOCU.ENUMERADO " +
					"                    )GROUP BY ESTADO, NOMBRE                    " +
					"             ) WHERE ESTADO IS NOT NULL " +
					"      )                      ";
		console.log("chart enumeradosFirmados: " + query);
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

